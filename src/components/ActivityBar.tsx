import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Files,
  Search,
  AlertCircle,
  Activity,
  Settings,
  BookOpen,
} from 'lucide-react';

export const ActivityBar: React.FC<{ onOpenDoc: () => void }> = ({ onOpenDoc }) => {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarTab,
    setSidebarTab,
    diagnostics,
    setSettingsModalOpen,
  } = useWorkspace();

  const handleTabClick = (tab: 'explorer' | 'search' | 'diagnostics' | 'simulation') => {
    if (sidebarOpen && sidebarTab === tab) {
      setSidebarOpen(false);
    } else {
      setSidebarTab(tab);
      setSidebarOpen(true);
    }
  };

  const errorCount = diagnostics.filter((d) => d.severity === 'error').length;

  return (
    <aside
      className="w-11 border-r flex flex-col justify-between items-center py-2 select-none shrink-0 z-20"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Top action tabs */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Explorer */}
        <button
          onClick={() => handleTabClick('explorer')}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
            sidebarOpen && sidebarTab === 'explorer'
              ? 'bg-[var(--bg-elevated)] text-[var(--border-focus)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
          }`}
          title="Explorer (Ctrl+Shift+E)"
        >
          <Files size={17} />
          {sidebarOpen && sidebarTab === 'explorer' && (
            <span
              className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r"
              style={{ backgroundColor: 'var(--border-focus)' }}
            />
          )}
        </button>

        {/* Search */}
        <button
          onClick={() => handleTabClick('search')}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
            sidebarOpen && sidebarTab === 'search'
              ? 'bg-[var(--bg-elevated)] text-[var(--border-focus)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
          }`}
          title="Search in Project (Ctrl+Shift+F)"
        >
          <Search size={17} />
          {sidebarOpen && sidebarTab === 'search' && (
            <span
              className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r"
              style={{ backgroundColor: 'var(--border-focus)' }}
            />
          )}
        </button>

        {/* Diagnostics / Invariants */}
        <button
          onClick={() => handleTabClick('diagnostics')}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
            sidebarOpen && sidebarTab === 'diagnostics'
              ? 'bg-[var(--bg-elevated)] text-[var(--border-focus)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
          }`}
          title="Formal Invariants & Diagnostics"
        >
          <AlertCircle size={17} />
          {errorCount > 0 && (
            <span
              className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-[9px] font-mono flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--status-error)' }}
            >
              {errorCount}
            </span>
          )}
          {sidebarOpen && sidebarTab === 'diagnostics' && (
            <span
              className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r"
              style={{ backgroundColor: 'var(--border-focus)' }}
            />
          )}
        </button>

        {/* Simulation */}
        <button
          onClick={() => handleTabClick('simulation')}
          className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
            sidebarOpen && sidebarTab === 'simulation'
              ? 'bg-[var(--bg-elevated)] text-[var(--border-focus)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
          }`}
          title="Simulation Telemetry & Scrubber"
        >
          <Activity size={17} />
          {sidebarOpen && sidebarTab === 'simulation' && (
            <span
              className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r"
              style={{ backgroundColor: 'var(--border-focus)' }}
            />
          )}
        </button>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Learn AXIOM Documentation */}
        <button
          onClick={onOpenDoc}
          className="w-8 h-8 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50 transition-colors"
          title="Learn AXIOM Formal Guide"
        >
          <BookOpen size={16} />
        </button>

        {/* Settings */}
        <button
          onClick={() => setSettingsModalOpen(true)}
          className="w-8 h-8 rounded flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50 transition-colors"
          title="Editor Settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </aside>
  );
};
