import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ChevronDown, ChevronUp, X, Replace, ReplaceAll } from 'lucide-react';

export const FindReplaceModal: React.FC = () => {
  const {
    findModalOpen,
    setFindModalOpen,
    activeFile,
    updateFileContent,
  } = useWorkspace();

  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const findInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (findModalOpen) {
      setTimeout(() => findInputRef.current?.focus(), 50);
    }
  }, [findModalOpen]);

  if (!findModalOpen || !activeFile) return null;

  const matchCount = findText
    ? (activeFile.content.match(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
    : 0;

  const handleReplaceOne = () => {
    if (!findText || !activeFile) return;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newContent = activeFile.content.replace(new RegExp(escaped), replaceText);
    updateFileContent(activeFile.id, newContent);
  };

  const handleReplaceAll = () => {
    if (!findText || !activeFile) return;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newContent = activeFile.content.replace(new RegExp(escaped, 'g'), replaceText);
    updateFileContent(activeFile.id, newContent);
  };

  return (
    <div
      className="absolute top-9 right-4 z-40 p-2 rounded-lg border shadow-xl flex flex-col gap-1.5 w-80 text-xs backdrop-blur-md select-none"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Find row */}
      <div className="flex items-center gap-1.5">
        <input
          ref={findInputRef}
          type="text"
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
          placeholder="Find in file..."
          className="flex-1 px-2 py-1 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)] font-mono"
        />
        <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0">
          {findText ? `${matchCount} results` : 'No results'}
        </span>
        <button
          onClick={() => setShowReplace(!showReplace)}
          className={`p-1 rounded hover:bg-[var(--bg-surface)] ${
            showReplace ? 'text-[var(--border-focus)]' : 'text-[var(--text-muted)]'
          }`}
          title="Toggle Replace"
        >
          <Replace size={13} />
        </button>
        <button
          onClick={() => setFindModalOpen(false)}
          className="p-1 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          title="Close (ESC)"
        >
          <X size={13} />
        </button>
      </div>

      {/* Replace row */}
      {showReplace && (
        <div className="flex items-center gap-1.5 pt-1 border-t border-[var(--border-subtle)]">
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace with..."
            className="flex-1 px-2 py-1 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] outline-none focus:border-[var(--border-focus)] font-mono"
          />
          <button
            onClick={handleReplaceOne}
            disabled={matchCount === 0}
            className="px-2 py-1 rounded bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[10px] disabled:opacity-40"
            title="Replace Next"
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            disabled={matchCount === 0}
            className="px-2 py-1 rounded bg-[var(--border-focus)] text-white hover:opacity-90 text-[10px] font-medium disabled:opacity-40"
            title="Replace All"
          >
            All
          </button>
        </div>
      )}
    </div>
  );
};
