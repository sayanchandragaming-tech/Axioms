import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Search, ChevronRight } from 'lucide-react';

export const SearchPanel: React.FC = () => {
  const { files, openFile } = useWorkspace();
  const [query, setQuery] = useState('');

  const results: Array<{
    fileId: string;
    fileName: string;
    lineNum: number;
    text: string;
  }> = [];

  if (query.trim().length > 1) {
    const qLower = query.toLowerCase();
    Object.values(files).forEach((file) => {
      const lines = file.content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes(qLower)) {
          results.push({
            fileId: file.id,
            fileName: file.name,
            lineNum: idx + 1,
            text: line.trim(),
          });
        }
      });
    });
  }

  return (
    <div
      className="w-64 border-r flex flex-col h-full select-none text-xs shrink-0 overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="h-8 px-3 flex items-center justify-between border-b text-[11px] font-semibold tracking-wider uppercase"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <span>Search</span>
      </div>

      <div className="p-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded border bg-[var(--bg-canvas)]" style={{ borderColor: 'var(--border-subtle)' }}>
          <Search size={12} className="text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in project..."
            className="w-full bg-transparent outline-none text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 font-mono">
        {query.trim().length > 1 && (
          <div className="text-[10px] text-[var(--text-muted)] mb-1">
            {results.length} result(s) in {new Set(results.map((r) => r.fileId)).size} file(s)
          </div>
        )}

        {results.map((res, idx) => (
          <div
            key={`${res.fileId}-${res.lineNum}-${idx}`}
            onClick={() => openFile(res.fileId)}
            className="p-1.5 rounded hover:bg-[var(--bg-elevated)] cursor-pointer flex flex-col gap-0.5 border border-transparent hover:border-[var(--border-subtle)] transition-colors"
          >
            <div className="flex items-center justify-between text-[10px] text-[var(--border-focus)]">
              <span>{res.fileName}</span>
              <span className="text-[var(--text-muted)]">Ln {res.lineNum}</span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] truncate">
              {res.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
