"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  if (!content) {
    return (
      <p className="text-slate-500 dark:text-slate-400 italic">No additional content provided for this lesson.</p>
    );
  }

  // Parse markdown into blocks
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={`space-y-4 text-slate-800 dark:text-slate-200 leading-relaxed ${className}`}>
      {blocks.map((block, index) => (
        <BlockElement key={index} block={block} />
      ))}
    </div>
  );
};

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "code"; code: string; language: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "p"; text: string };

function parseMarkdownBlocks(text: string): Block[] {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // Empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Code block: ```language
    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith("```")) {
        i++; // skip closing ```
      }
      blocks.push({
        type: "code",
        code: codeLines.join("\n"),
        language: language || "text",
      });
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [line.slice(2).trim()];
      i++;
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }

    // Unordered List: - or *
    if (line.match(/^[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-*]\s+/)) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered List: 1. or 2.
    if (line.match(/^\d+\.\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s+/)) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Standard Paragraph (collect lines until blank line or next block)
    const pLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().match(/^[-*]\s+/) &&
      !lines[i].trim().match(/^\d+\.\s+/)
    ) {
      pLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", text: pLines.join(" ") });
  }

  return blocks;
}

const BlockElement: React.FC<{ block: Block }> = ({ block }) => {
  switch (block.type) {
    case "h1":
      return (
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white pt-6 pb-2 border-b border-slate-200 dark:border-slate-800 tracking-tight">
          <InlineText text={block.text} />
        </h1>
      );
    case "h2":
      return (
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 pt-5 pb-1 tracking-tight flex items-center gap-x-2">
          <span className="w-1.5 h-5 rounded-full bg-amber-500 inline-block" />
          <InlineText text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 pt-3">
          <InlineText text={block.text} />
        </h3>
      );
    case "code":
      return <CodeBlock code={block.code} language={block.language} />;
    case "ul":
      return (
        <ul className="list-disc pl-6 space-y-2 my-3 text-slate-700 dark:text-slate-300">
          {block.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal pl-6 space-y-2 my-3 text-slate-700 dark:text-slate-300">
          {block.items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              <InlineText text={item} />
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="my-4 p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-slate-700 dark:text-slate-300 italic text-sm">
          <InlineText text={block.text} />
        </blockquote>
      );
    case "p":
      return (
        <p className="leading-relaxed text-slate-700 dark:text-slate-300 my-2 text-sm sm:text-base">
          <InlineText text={block.text} />
        </p>
      );
    default:
      return null;
  }
};

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-2xl overflow-hidden border border-slate-800 bg-[#0A0D14] shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-x-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Inline parser for bold, italic, code, and links
const InlineText: React.FC<{ text: string }> = ({ text }) => {
  // Regex to match:
  // 1. Links: [title](url)
  // 2. Bold: **text**
  // 3. Inline code: `code`
  // 4. Italic: *text*
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  const pattern = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`|\*.*?\*)/;

  while (remaining.length > 0) {
    const match = remaining.match(pattern);
    if (!match || match.index === undefined) {
      parts.push(remaining);
      break;
    }

    const matchIndex = match.index;
    if (matchIndex > 0) {
      parts.push(remaining.slice(0, matchIndex));
    }

    const token = match[0];
    if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const titleMatch = token.match(/\[(.*?)\]/);
      const urlMatch = token.match(/\((.*?)\)/);
      const linkTitle = titleMatch ? titleMatch[1] : token;
      const linkUrl = urlMatch ? urlMatch[1] : "#";

      parts.push(
        <a
          key={keyIndex++}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 dark:text-amber-400 hover:underline font-semibold inline-flex items-center gap-x-0.5"
        >
          <span>{linkTitle}</span>
          <ExternalLink className="h-3 w-3 inline" />
        </a>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={keyIndex++} className="font-bold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={keyIndex++}
          className="px-1.5 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold border border-amber-500/20"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={keyIndex++} className="italic text-slate-800 dark:text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      parts.push(token);
    }

    remaining = remaining.slice(matchIndex + token.length);
  }

  return <>{parts}</>;
};

