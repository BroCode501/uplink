'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-slate-900 text-slate-50 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">{language}</span>
        <button
          onClick={copyToClipboard}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className = '',
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-muted hover:bg-muted/80 transition-colors flex items-center justify-between"
      >
        <span className="font-semibold text-left">{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && <div className="p-4 border-t border-border">{children}</div>}
    </div>
  );
}

interface RequestBodyTableProps {
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

export function RequestBodyTable({ fields }: RequestBodyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-4 py-2 text-left font-semibold">Field</th>
            <th className="px-4 py-2 text-left font-semibold">Type</th>
            <th className="px-4 py-2 text-left font-semibold">Required</th>
            <th className="px-4 py-2 text-left font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, idx) => (
            <tr
              key={idx}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-2 font-mono text-amber-700 dark:text-amber-400">
                {field.name}
              </td>
              <td className="px-4 py-2 font-mono text-muted-foreground">
                {field.type}
              </td>
              <td className="px-4 py-2">
                {field.required ? (
                  <span className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-2 py-1 rounded text-xs font-semibold">
                    Required
                  </span>
                ) : (
                  <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-1 rounded text-xs font-semibold">
                    Optional
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                {field.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface StatusCodeProps {
  code: number;
  description: string;
  children?: React.ReactNode;
}

export function StatusCode({ code, description, children }: StatusCodeProps) {
  const statusColor =
    code >= 200 && code < 300
      ? 'text-green-700 dark:text-green-400'
      : code >= 400
        ? 'text-red-700 dark:text-red-400'
        : code >= 500
          ? 'text-red-700 dark:text-red-400'
          : 'text-amber-700 dark:text-amber-400';

  return (
    <div className="border-l-4 border-border pl-4 py-2 mb-4">
      <div className={`font-bold ${statusColor}`}>
        {code} {description}
      </div>
      {children && <div className="text-sm mt-2 text-muted-foreground">{children}</div>}
    </div>
  );
}
