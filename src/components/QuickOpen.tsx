import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { FileCode, Search } from 'lucide-react';

export const QuickOpen: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { files, openFile } = useWorkspace();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fileList = Object.values(files);
  const filtered = fileList.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.path.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        openFile(filtered[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border shadow-2xl flex flex-col overflow-hidden text-xs"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-3 py-2 border-b flex items-center gap-2"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <Search size={14} className="text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search files by name..."
            className="w-full bg-transparent outline-none text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)]"
          />
        </div>

        <div className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="py-4 text-center text-[var(--text-muted)]">No matching files.</div>
          ) : (
            filtered.map((file, idx) => (
              <div
                key={file.id}
                onClick={() => {
                  openFile(file.id);
                  onClose();
                }}
                className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                  idx === selectedIndex
                    ? 'bg-[var(--border-focus)]/15 text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-mono shrink-0 font-bold"
                    style={{
                      color: 'var(--border-focus)',
                      backgroundColor: 'rgba(62, 130, 247, 0.12)',
                    }}
                  >
                    ∀
                  </span>
                  <span className="font-medium text-xs text-[var(--text-primary)]">
                    {file.name}
                  </span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  {file.path}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
