import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { X, Plus, Terminal } from 'lucide-react';

export const TabBar: React.FC = () => {
  const {
    openTabs,
    activeTabId,
    setActiveTab,
    closeTab,
    createNewFile,
    diagnostics,
  } = useWorkspace();

  return (
    <div
      className="h-8 flex items-center border-b select-none overflow-x-auto overflow-y-hidden text-xs shrink-0"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {openTabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const hasError =
          tab.fileId &&
          diagnostics.some((d) => d.fileId === tab.fileId && d.severity === 'error');

        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative h-full flex items-center gap-2 px-3 cursor-pointer border-r transition-colors ${
              isActive
                ? 'text-[var(--text-primary)] font-medium'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/40'
            }`}
            style={{
              backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {/* 2px Active Top Accent Strip */}
            {isActive && (
              <span
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: 'var(--border-focus)' }}
              />
            )}

            {/* Icon */}
            {tab.type === 'welcome' ? (
              <Terminal size={12} className="text-[var(--border-focus)] shrink-0" />
            ) : (
              <span
                className="w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-mono shrink-0 font-bold"
                style={{
                  color: hasError ? 'var(--status-error)' : 'var(--border-focus)',
                  backgroundColor: hasError ? 'rgba(224, 108, 117, 0.15)' : 'rgba(62, 130, 247, 0.12)',
                }}
              >
                ∀
              </span>
            )}

            {/* Tab Title */}
            <span className="truncate max-w-[140px] text-xs">{tab.title}</span>

            {/* Dirty unsaved dot or Close button */}
            <div className="w-4 h-4 flex items-center justify-center ml-0.5">
              {tab.isModified ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="w-2 h-2 rounded-full group-hover:hidden transition-transform"
                  style={{ backgroundColor: 'var(--syntax-definition)' }}
                  title="Unsaved changes"
                />
              ) : null}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className={`p-0.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ${
                  tab.isModified ? 'hidden group-hover:flex' : 'flex'
                }`}
                title="Close Tab (Ctrl+W)"
              >
                <X size={11} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Plus button to quickly create new .axiom file */}
      <button
        onClick={() => createNewFile()}
        className="h-full px-2.5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50 transition-colors"
        title="New AXIOM File (Ctrl+N)"
      >
        <Plus size={13} />
      </button>
    </div>
  );
};
