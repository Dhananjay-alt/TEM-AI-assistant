"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** Number of sources this answer may cite; [1]..[n] become clickable. */
  citationCount?: number;
  /** Index (0-based) of the citation currently open in the source viewer. */
  activeCitation?: number | null;
  onCite?: (index: number) => void;
}

/** Turns [n] markers into links, leaving equations and code untouched. */
function linkCitations(text: string, count: number): string {
  if (count <= 0) return text;
  return text
    .split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*\$|```[\s\S]*?```|`[^`\n]*`)/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(/\[(\d{1,2})\](?!\()/g, (whole, n) => {
            const num = parseInt(n, 10);
            return num >= 1 && num <= count ? `[${num}](#cite-${num})` : whole;
          })
    )
    .join("");
}

export function MarkdownRenderer({
  content,
  className = "",
  citationCount = 0,
  activeCitation = null,
  onCite,
}: MarkdownRendererProps) {
  const normalized = linkCitations(
    (content || "")
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, eq) => `\n\n$$\n${eq.trim()}\n$$\n\n`)
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, eq) => `$${eq.trim()}$`)
      // headings need a blank line before them and a space after the hashes
      .replace(/([^\n])\n(#{1,4}\s+)/g, "$1\n\n$2")
      .replace(/(?:^|\n)(#{1,4})([A-Za-z0-9])/g, "\n$1 $2")
      .trim(),
    onCite ? citationCount : 0
  );

  return (
    <div className={`text-[15px] leading-7 text-foreground ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => <h1 className="mt-6 mb-2 text-lg font-semibold first:mt-0" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mt-6 mb-2 text-base font-semibold first:mt-0" {...props} />,
          h3: ({ node, ...props }) => <h3 className="mt-5 mb-1.5 text-[15px] font-semibold first:mt-0" {...props} />,
          h4: ({ node, ...props }) => <h4 className="mt-4 mb-1 text-sm font-semibold text-muted first:mt-0" {...props} />,
          p: ({ node, ...props }) => <p className="mb-3 last:mb-0 break-words" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          ul: ({ node, ...props }) => <ul className="my-3 list-disc space-y-1 pl-5 marker:text-faint" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-3 list-decimal space-y-1 pl-5 marker:text-faint" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="my-3 border-l-2 border-line-strong pl-4 text-muted" {...props} />
          ),
          a: ({ node, href, children, ...props }) => {
            if (href && href.startsWith("#cite-")) {
              const idx = parseInt(href.slice(6), 10) - 1;
              return (
                <button
                  type="button"
                  className="cite"
                  data-active={activeCitation === idx}
                  onClick={() => onCite?.(idx)}
                  aria-label={`Open source ${idx + 1}`}
                  title={`Open source ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            }
            return (
              <a href={href} className="text-accent underline underline-offset-2" target="_blank" rel="noreferrer" {...props}>
                {children}
              </a>
            );
          },
          table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto rounded-md border border-line">
              <table className="w-full border-collapse text-left text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-surface-2 text-muted" {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-line last:border-b-0" {...props} />,
          th: ({ node, ...props }) => <th className="px-3 py-2 font-medium" {...props} />,
          td: ({ node, ...props }) => <td className="px-3 py-2 align-top" {...props} />,
          code: ({ node, inline, className: cls, children, ...props }: any) => {
            const isBlock = /language-/.test(cls || "") || String(children).includes("\n");
            if (!isBlock) {
              return (
                <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px]" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={`font-mono text-[13px] ${cls || ""}`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="my-3 overflow-x-auto rounded-md border border-line bg-surface-2 p-3 leading-6" {...props} />
          ),
          hr: () => <hr className="my-5 border-t border-line" />,
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
