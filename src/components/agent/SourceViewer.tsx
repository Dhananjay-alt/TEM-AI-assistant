"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Info, Minus, Plus, Undo2, X } from "lucide-react";
import { RetrievedSource } from "@/lib/rag/vector-search";

interface SourceViewerProps {
  source: RetrievedSource;
  /** 0-based position of the source in the answer's reference list. */
  index: number;
  onClose: () => void;
}

/* pdf.js is served from /public/pdfjs and loaded straight in the browser. */
let pdfjsPromise: Promise<any> | null = null;
function loadPdfJs(): Promise<any> {
  if (!pdfjsPromise) {
    const url = "/pdfjs/pdf.min.mjs";
    pdfjsPromise = import(/* webpackIgnore: true */ url).then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      return lib;
    });
    pdfjsPromise.catch(() => {
      pdfjsPromise = null;
    });
  }
  return pdfjsPromise;
}

/* One document for the whole session; pages are fetched on demand by range request. */
let documentPromise: Promise<any> | null = null;
function loadDocument(): Promise<any> {
  if (!documentPromise) {
    documentPromise = loadPdfJs().then(
      (lib) =>
        lib.getDocument({
          url: "/api/book/file",
          rangeChunkSize: 262144,
          disableAutoFetch: true,
          disableStream: true,
        }).promise
    );
    documentPromise.catch(() => {
      documentPromise = null;
    });
  }
  return documentPromise;
}

export function sourceTitle(s: RetrievedSource): string {
  if (s.chapterNumber) return `Chapter ${s.chapterNumber}${s.chapterTitle ? ` · ${s.chapterTitle}` : ""}`;
  return s.chapterTitle || s.book;
}

export function sourceLocator(s: RetrievedSource): string {
  if (s.kind === "pdf") return `p. ${s.pageLabel || s.pdfPage}`;
  return `§${s.sectionNumber} · approx. pp. ${s.page}–${s.pageEnd}`;
}

export function SourceViewer({ source, index, onClose }: SourceViewerProps) {
  const isPdf = source.kind === "pdf" && typeof source.pdfPage === "number";

  return (
    <aside
      className="fixed inset-x-0 top-0 z-50 flex h-[100dvh] flex-col bg-surface lg:static lg:z-auto lg:h-full lg:w-[46%] lg:min-w-[380px] lg:max-w-[760px] lg:shrink-0 lg:border-l lg:border-line"
      aria-label="Source viewer"
    >
      <header className="flex items-start gap-3 border-b border-line px-4 py-3">
        <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded bg-accent px-1 text-[11px] font-semibold text-accent-fg">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">{sourceTitle(source)}</div>
          <div className="truncate text-xs text-muted">
            {source.sectionTitle ? `${source.sectionTitle} · ` : ""}
            {sourceLocator(source)}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close source viewer"
          title="Close"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {isPdf ? <PdfPage source={source} /> : <ExcerptView source={source} />}
    </aside>
  );
}

/* ---------------------------------------------------------------- */

function ExcerptView({ source }: { source: RetrievedSource }) {
  const segments = source.segments && source.segments.length > 0 ? source.segments : [source.excerpt];
  const focus = new Set(source.focus || []);
  const markRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    markRef.current?.scrollIntoView({ block: "center" });
  }, [source.chunkId]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-5">
      <div className="mb-5 flex gap-2.5 rounded-md border border-line bg-surface-2 p-3 text-xs leading-5 text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          This is a stored summary, not the original page. The textbook PDF has not been indexed yet, so the page
          range is approximate. Add the PDF to the <code className="font-mono">book</code> folder and run{" "}
          <code className="font-mono">npm run index-book</code> to open the real page with the lines highlighted.
        </p>
      </div>

      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-faint">Passage</div>
      <p className="font-serif text-[16px] leading-8 text-foreground">
        {segments.map((seg, i) =>
          focus.has(i) ? (
            <mark
              key={i}
              className="source-mark"
              ref={(el) => {
                if (el && !markRef.current) markRef.current = el;
              }}
            >
              {seg}{" "}
            </mark>
          ) : (
            <span key={i}>{seg} </span>
          )
        )}
      </p>

      {source.formulas && source.formulas.length > 0 && (
        <div className="mt-6">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-faint">Equations</div>
          <div className="space-y-1 rounded-md border border-line bg-surface-2 p-3 font-mono text-xs text-foreground">
            {source.formulas.map((f, i) => (
              <div key={i}>{f}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */

const ZOOMS = [1, 1.25, 1.5, 2];

function PdfPage({ source }: { source: RetrievedSource }) {
  const citedPage = source.pdfPage as number;
  const [page, setPage] = useState(citedPage);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [fitWidth, setFitWidth] = useState(0);
  const [pageSize, setPageSize] = useState<{ w: number; h: number } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const focusRef = useRef<HTMLDivElement | null>(null);

  // a new citation resets the view to its page
  useEffect(() => {
    setPage(citedPage);
    setZoom(0);
  }, [source.chunkId, citedPage]);

  // track the width available for the page
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setFitWidth(Math.max(240, el.clientWidth - 32));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // render the page
  useEffect(() => {
    if (!fitWidth) return;
    let cancelled = false;
    let task: any = null;
    setStatus("loading");

    (async () => {
      try {
        const doc = await loadDocument();
        if (cancelled) return;
        setNumPages(doc.numPages);
        const pdfPage = await doc.getPage(Math.min(Math.max(1, page), doc.numPages));
        if (cancelled) return;

        const base = pdfPage.getViewport({ scale: 1 });
        const cssWidth = fitWidth * ZOOMS[zoom];
        const cssScale = cssWidth / base.width;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = pdfPage.getViewport({ scale: cssScale * dpr });

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        setPageSize({ w: cssWidth, h: base.height * cssScale });

        task = pdfPage.render({ canvasContext: canvas.getContext("2d"), viewport });
        await task.promise;
        if (cancelled) return;
        setStatus("ready");
      } catch (err: any) {
        if (cancelled || err?.name === "RenderingCancelledException") return;
        console.error("Could not render the source page:", err);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      try {
        task?.cancel();
      } catch {
        // already finished
      }
    };
  }, [page, zoom, fitWidth, source.chunkId]);

  // bring the cited lines into view once the page is drawn
  useEffect(() => {
    if (status === "ready" && page === citedPage) {
      focusRef.current?.scrollIntoView({ block: "center", inline: "nearest" });
    }
  }, [status, page, citedPage, zoom, source.chunkId]);

  const go = useCallback(
    (delta: number) => setPage((p) => Math.min(Math.max(1, p + delta), numPages || p + delta)),
    [numPages]
  );

  const rects = source.rects || [];
  const focus = new Set(source.focus || []);
  const firstFocus = focus.size > 0 ? Math.min(...Array.from(focus)) : 0;
  const onCitedPage = page === citedPage;
  const btn =
    "inline-flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-surface-2 hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <>
      <div className="flex items-center gap-1 border-b border-line px-3 py-1.5 text-xs text-muted">
        <button type="button" className={btn} onClick={() => go(-1)} disabled={page <= 1} aria-label="Previous page" title="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="tabular-nums">
          PDF page {page}
          {numPages ? ` of ${numPages}` : ""}
        </span>
        <button
          type="button"
          className={btn}
          onClick={() => go(1)}
          disabled={numPages !== null && page >= numPages}
          aria-label="Next page"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {!onCitedPage && (
          <button
            type="button"
            onClick={() => setPage(citedPage)}
            className="ml-1 inline-flex items-center gap-1 rounded px-2 py-1 text-accent hover:bg-accent-soft"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Back to cited passage
          </button>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button type="button" className={btn} onClick={() => setZoom((z) => Math.max(0, z - 1))} disabled={zoom === 0} aria-label="Zoom out" title="Zoom out">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center tabular-nums">{Math.round(ZOOMS[zoom] * 100)}%</span>
          <button
            type="button"
            className={btn}
            onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
            disabled={zoom === ZOOMS.length - 1}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <a
            href={`/api/book/file#page=${page}`}
            target="_blank"
            rel="noreferrer"
            className={btn}
            aria-label="Open the PDF in a new tab"
            title="Open the PDF in a new tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div ref={scrollRef} className="relative flex-1 overflow-auto bg-surface-2 p-4">
        {status === "error" ? (
          <div className="mx-auto mt-10 max-w-sm text-center text-sm text-muted">
            <p className="font-medium text-foreground">The page could not be displayed.</p>
            <p className="mt-1">Check that the PDF is still in the book folder, then select the reference again.</p>
            <p className="mt-4 rounded-md border border-line bg-surface p-3 text-left font-serif text-[15px] leading-7 text-foreground">
              {source.excerpt}
            </p>
          </div>
        ) : (
          <div
            className="relative mx-auto bg-white shadow-panel"
            style={pageSize ? { width: pageSize.w, height: pageSize.h } : { width: fitWidth, height: fitWidth * 1.3 }}
          >
            <canvas ref={canvasRef} className="block h-full w-full" />
            {status === "ready" &&
              onCitedPage &&
              rects.map((r, i) => (
                <div
                  key={i}
                  ref={i === firstFocus ? focusRef : undefined}
                  className="pdf-hl"
                  data-focus={focus.has(i)}
                  style={{
                    left: `${(r[0] - 0.004) * 100}%`,
                    top: `${(r[1] - 0.002) * 100}%`,
                    width: `${(r[2] + 0.008) * 100}%`,
                    height: `${(r[3] + 0.004) * 100}%`,
                  }}
                />
              ))}
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
                Loading page…
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-2 text-[11px] leading-4 text-faint">
        The highlighted lines are the passage this reference points to; the darker lines match the answer most closely.
      </div>
    </>
  );
}
