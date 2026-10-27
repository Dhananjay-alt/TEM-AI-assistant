"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Normalize latex block markers and markdown headers
  const normalizedContent = (content || "")
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, eq) => `\n\n$$\n${eq.trim()}\n$$\n\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, eq) => `$${eq.trim()}$`)
    // Ensure markdown headings have preceding double newlines so GFM parses them as headings
    .replace(/([^\n])\n(#{1,4}\s+)/g, "$1\n\n$2")
    // Ensure headings have space after hash symbols
    .replace(/(?:^|\n)(#{1,4})([A-Za-z0-9])/g, "\n$1 $2")
    // Transform literal "### FROM CARTER" inside content into a clean heading
    .replace(/(?:^|\n)#{1,4}\s*FROM\s+CARTER[^\n]*/gi, "\n\n### CARTER TEXTBOOK REFERENCE\n")
    .trim();

  return (
    <div className={`prose-tem font-sans text-sm sm:text-[15px] leading-relaxed text-white/90 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="font-serif font-bold text-lg sm:text-xl text-white mt-4 mb-2 tracking-tight" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="font-serif font-semibold text-base sm:text-lg text-white mt-4 mb-2 tracking-tight border-b border-white/10 pb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="font-serif font-medium text-sm sm:text-base text-[#FF4500] mt-3 mb-1.5 uppercase tracking-wide flex items-center gap-1.5" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="font-sans font-bold text-xs sm:text-sm text-white/80 mt-2 mb-1 uppercase tracking-wider" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed break-words text-white/85" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-white" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-white/80" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 marker:text-[#FF4500]" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 marker:font-bold marker:font-mono marker:text-xs marker:text-[#FF4500]" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed pl-1 text-white/85" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-[#FF4500] bg-white/5 pl-3.5 py-1.5 my-2.5 italic text-white/80 rounded-r-lg" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 border border-white/15 rounded-xl shadow-lg">
              <table className="w-full text-left text-xs border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#18181b] text-[#FF4500] font-mono uppercase font-bold border-b border-white/10" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-white/10 bg-[#0d0d0e]" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-white/5 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 border-r border-white/10 last:border-r-0 font-bold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 border-r border-white/10 last:border-r-0 font-sans text-white/80" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="font-mono text-[12px] bg-white/10 text-[#FF4500] border border-white/15 px-1.5 py-0.5 rounded font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="overflow-x-auto my-2.5 p-3.5 bg-[#09090b] text-white border border-white/15 rounded-xl font-mono text-xs leading-normal">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          hr: () => <hr className="my-3 border-t border-white/10" />,
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
