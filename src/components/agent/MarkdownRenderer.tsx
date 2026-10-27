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
    <div className={`prose-tem font-grotesk text-sm sm:text-[15px] leading-relaxed text-[#09090B] ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="font-display font-black text-lg sm:text-xl text-[#09090B] mt-4 mb-2 tracking-tight" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="font-display font-bold text-base sm:text-lg text-[#09090B] mt-3.5 mb-2 tracking-tight border-b border-slate-300 pb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="font-display font-bold text-sm sm:text-base text-[#09090B] mt-3 mb-1.5 uppercase tracking-wide flex items-center gap-1.5" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="font-display font-bold text-xs sm:text-sm text-slate-800 mt-2 mb-1 uppercase" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed break-words" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-[#09090B]" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-slate-800" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 marker:text-[#09090B]" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 marker:font-bold marker:font-mono marker:text-xs marker:text-[#09090B]" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed pl-1" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-[#09090B] bg-[#F8F4E8] pl-3.5 py-1.5 my-2.5 italic text-slate-800 rounded-r" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3 border-2 border-[#09090B] rounded-lg shadow-hard-xs">
              <table className="w-full text-left text-xs border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#09090B] text-[#D2E823] font-mono uppercase font-bold" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-slate-200 bg-white" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-slate-50 transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 border-r border-slate-700 last:border-r-0 font-bold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 border-r border-slate-200 last:border-r-0 font-grotesk text-slate-800" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="font-mono text-[12px] bg-slate-200/80 text-[#09090B] border border-slate-300 px-1 py-0.5 rounded font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="overflow-x-auto my-2.5 p-3 bg-[#09090B] text-[#F8F4E8] border-2 border-[#09090B] rounded-lg font-mono text-xs leading-normal">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          hr: () => <hr className="my-3 border-t-2 border-slate-300" />,
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
