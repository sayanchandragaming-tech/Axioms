import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Play,
  RotateCcw,
  Square,
  FilePlus,
  FolderOpen,
  Save,
  AlignLeft,
  Sidebar,
  Terminal,
  Sun,
  Moon,
  Home,
  BookOpen,
  Search,
  Settings,
  Zap,
} from 'lucide-react';

export const CommandPalette: React.FC<{ onOpenDoc: () => void }> = ({ onOpenDoc }) => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    runCode,
    stepSimulation,
    restartSimulation,
    stopSimulation,
    createNewFile,
    saveActiveFile,
    formatCurrentFile,
    toggleSidebar,
    toggleBottomPanel,
    theme,
    setTheme,
    openWelcomeTab,
    setSettingsModalOpen,
    setSidebarTab,
    setSidebarOpen,
    openFile,
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const commands = [
    {
      id: 'cmd-run',
      title: 'Run AXIOM',
      detail: 'Execute active model and verify invariants',
      icon: <Play size={14} className="text-emerald-500" />,
      shortcut: 'Ctrl+Enter',
      action: () => runCode(),
    },
    {
      id: 'cmd-sim',
      title: 'Run Simulation',
      detail: 'Advance temporal integration loop',
      icon: <Zap size={14} className="text-blue-500" />,
      shortcut: 'F5',
      action: () => runCode(),
    },
    {
      id: 'cmd-step',
      title: 'Run Without Visualization',
      detail: 'Fast deterministic background integration',
      icon: <Play size={14} className="text-amber-500" />,
      shortcut: 'Ctrl+F5',
      action: () => runCode(),
    },
    {
      id: 'cmd-stop',
      title: 'Stop Simulation',
      detail: 'Halt ongoing runtime step engine',
      icon: <Square size={14} className="text-rose-500" />,
      shortcut: 'Shift+F5',
      action: () => stopSimulation(),
    },
    {
      id: 'cmd-restart',
      title: 'Restart Simulation',
      detail: 'Reset state to T=0 initial boundary condition',
      icon: <RotateCcw size={14} />,
      shortcut: 'Ctrl+Shift+F5',
      action: () => restartSimulation(),
    },
    {
      id: 'cmd-new-file',
      title: 'New AXIOM File',
      detail: 'Create a new .axiom formal model',
      icon: <FilePlus size={14} className="text-[var(--border-focus)]" />,
      shortcut: 'Ctrl+N',
      action: () => createNewFile(),
    },
    {
      id: 'cmd-open-proj',
      title: 'Open Project',
      detail: 'Open default AXIOM Project workspace',
      icon: <FolderOpen size={14} />,
      shortcut: 'Ctrl+O',
      action: () => openFile('file-main'),
    },
    {
      id: 'cmd-save',
      title: 'Save',
      detail: 'Persist active buffer to workspace',
      icon: <Save size={14} />,
      shortcut: 'Ctrl+S',
      action: () => saveActiveFile(),
    },
    {
      id: 'cmd-format',
      title: 'Format AXIOM',
      detail: 'Format code according to mathematical indentation standard',
      icon: <AlignLeft size={14} />,
      shortcut: 'Shift+Alt+F',
      action: () => formatCurrentFile(),
    },
    {
      id: 'cmd-toggle-explorer',
      title: 'Toggle Explorer',
      detail: 'Show or hide project file tree',
      icon: <Sidebar size={14} />,
      shortcut: 'Ctrl+B',
      action: () => toggleSidebar(),
    },
    {
      id: 'cmd-toggle-console',
      title: 'Toggle Console',
      detail: 'Show or hide bottom console & diagnostics drawer',
      icon: <Terminal size={14} />,
      shortcut: 'Ctrl+`',
      action: () => toggleBottomPanel(),
    },
    {
      id: 'cmd-toggle-theme',
      title: 'Toggle Theme',
      detail: `Switch to ${theme === 'dark' ? 'Milky White' : 'Obsidian Black'}`,
      icon: theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />,
      shortcut: 'Ctrl+K Ctrl+T',
      action: () => setTheme(theme === 'dark' ? 'milky-white' : 'dark'),
    },
    {
      id: 'cmd-welcome',
      title: 'Open Welcome',
      detail: 'Display AXIOM Editor welcome and shortcuts portal',
      icon: <Home size={14} />,
      shortcut: '',
      action: () => openWelcomeTab(),
    },
    {
      id: 'cmd-doc',
      title: 'Open AXIOM Documentation',
      detail: 'Mathematical syntax and formal semantics manual',
      icon: <BookOpen size={14} />,
      shortcut: 'F1',
      action: () => onOpenDoc(),
    },
    {
      id: 'cmd-search',
      title: 'Search Project',
      detail: 'Find occurrences across all models',
      icon: <Search size={14} />,
      shortcut: 'Ctrl+Shift+F',
      action: () => {
        setSidebarTab('search');
        setSidebarOpen(true);
      },
    },
    {
      id: 'cmd-settings',
      title: 'Settings',
      detail: 'Configure editor, solver precision, and appearance',
      icon: <Settings size={14} />,
      shortcut: 'Ctrl+,',
      action: () => setSettingsModalOpen(true),
    },
  ];

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase();
    return cmd.title.toLowerCase().includes(q) || cmd.detail.toLowerCase().includes(q);
  });

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
        filtered[selectedIndex].action();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/50 backdrop-blur-xs select-none"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-lg border shadow-2xl flex flex-col overflow-hidden text-xs"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div
          className="px-3 py-2.5 border-b flex items-center gap-2"
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
            placeholder="Type a command or search actions..."
            className="w-full bg-transparent outline-none text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)]"
          />
          <kbd
            className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Command Items List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-[var(--text-muted)]">
              No matching commands.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    setCommandPaletteOpen(false);
                  }}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[var(--border-focus)]/15 text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{cmd.icon}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-xs text-[var(--text-primary)] truncate">
                        {cmd.title}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] truncate font-sans">
                        {cmd.detail}
                      </span>
                    </div>
                  </div>

                  {cmd.shortcut && (
                    <kbd
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0"
                      style={{
                        backgroundColor: 'var(--bg-canvas)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {cmd.shortcut}
                    </kbd>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
