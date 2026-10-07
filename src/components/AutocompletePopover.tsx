import React, { useEffect, useRef } from 'react';
import { AutocompleteSuggestion } from '../types/axiom';

interface AutocompletePopoverProps {
  suggestions: AutocompleteSuggestion[];
  selectedIndex: number;
  onSelect: (item: AutocompleteSuggestion) => void;
  position: { top: number; left: number };
  onClose: () => void;
}

export const AutocompletePopover: React.FC<AutocompletePopoverProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  position,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (suggestions.length === 0) return null;

  return (
    <div
      className="absolute z-50 w-72 rounded border shadow-2xl flex flex-col overflow-hidden text-xs select-none backdrop-blur-md"
      style={{
        top: position.top,
        left: position.left,
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-focus)',
      }}
    >
      {/* Header hint */}
      <div
        className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider flex items-center justify-between border-b"
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
        }}
      >
        <span>AXIOM Formal Suggestions</span>
        <span className="text-[9px]">Tab / ↵ to insert</span>
      </div>

      {/* Suggestion items list */}
      <div ref={listRef} className="max-h-48 overflow-y-auto py-0.5">
        {suggestions.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <div
              key={`${item.label}-${idx}`}
              onClick={() => onSelect(item)}
              className={`px-2.5 py-1.5 flex items-center justify-between cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[var(--border-focus)]/20 text-[var(--text-primary)]'
                  : 'hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-4 h-4 rounded text-[9px] font-mono flex items-center justify-center shrink-0 font-bold"
                  style={{
                    backgroundColor:
                      item.kind === 'property'
                        ? 'rgba(72, 179, 133, 0.15)'
                        : item.kind === 'unit'
                        ? 'rgba(229, 192, 123, 0.15)'
                        : 'rgba(62, 130, 247, 0.15)',
                    color:
                      item.kind === 'property'
                        ? 'var(--syntax-rule)'
                        : item.kind === 'unit'
                        ? 'var(--syntax-unit)'
                        : 'var(--syntax-keyword)',
                  }}
                >
                  {item.kind === 'property' ? 'p' : item.kind === 'unit' ? 'u' : 'k'}
                </span>
                <span className="font-mono font-medium truncate text-xs text-[var(--text-primary)]">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[80px]">
                  {item.detail}
                </span>
                {item.unitOrType && (
                  <span
                    className="text-[9px] font-mono px-1 py-0.2 rounded"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--syntax-unit)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {item.unitOrType}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected documentation preview footer */}
      {suggestions[selectedIndex]?.documentation && (
        <div
          className="p-2 border-t text-[11px] font-mono"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
          }}
        >
          {suggestions[selectedIndex].documentation}
        </div>
      )}
    </div>
  );
};
