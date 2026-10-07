import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Play,
  Square,
  RotateCcw,
  StepForward,
  Sun,
  Moon,
  Settings,
  PanelBottom,
  Sidebar,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  FolderOpen,
  Save,
  HelpCircle,
  Terminal,
} from 'lucide-react';

export const TopBar: React.FC<{ onOpenDoc: () => void }> = ({ onOpenDoc }) => {
  const {
    theme,
    setTheme,
    simulationState,
    runCode,
    stepSimulation,
    pauseSimulation,
    resumeSimulation,
    restartSimulation,
    stopSimulation,
    toggleSidebar,
    sidebarOpen,
    toggleBottomPanel,
    bottomPanelOpen,
    setSettingsModalOpen,
    setCommandPaletteOpen,
    setFindModalOpen,
    openWelcomeTab,
    saveActiveFile,
    createNewFile,
    formatCurrentFile,
    activeFile,
  } = useWorkspace();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSimRunning = simulationState.status === 'running';

  return (
    <header className="h-9 px-3 border-b flex items-center justify-between text-xs select-none z-30 shrink-0"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-primary)',
      }}>
      {/* Left: Brand & Menus */}
      <div className="flex items-center gap-3">
        {/* Brand glyph */}
        <div className="flex items-center gap-1.5 font-semibold tracking-tight text-[13px]">
          <span
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-mono font-bold text-white shadow-xs"
            style={{ backgroundColor: 'var(--border-focus)' }}
            title="AXIOM Formal System"
          >
            ∀
          </span>
          <span className="tracking-wide">AXIOM</span>
          <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded text-[10px]"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}>
            IDE v0.1
          </span>
        </div>

        {/* Application Menus */}
        <div className="relative flex items-center gap-0.5 ml-1" ref={menuRef}>
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMenu === 'file' ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 py-1 rounded shadow-lg border z-50 text-xs"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => {
                    createNewFile();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--border-focus)]/15"
                >
                  <span className="flex items-center gap-2">
                    <FileCode size={13} /> New AXIOM File
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Ctrl+N</span>
                </button>
                <button
                  onClick={() => {
                    saveActiveFile();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--border-focus)]/15"
                >
                  <span className="flex items-center gap-2">
                    <Save size={13} /> Save File
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Ctrl+S</span>
                </button>
                <div className="h-[1px] my-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
                <button
                  onClick={() => {
                    openWelcomeTab();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--border-focus)]/15"
                >
                  <FolderOpen size={13} /> Welcome Screen
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMenu === 'edit' ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
              }`}
            >
              Edit
            </button>
            {activeMenu === 'edit' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 py-1 rounded shadow-lg border z-50 text-xs"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => {
                    formatCurrentFile();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--border-focus)]/15"
                >
                  <span>Format AXIOM Model</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Shift+Alt+F</span>
                </button>
                <button
                  onClick={() => {
                    setFindModalOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--border-focus)]/15"
                >
                  <span>Find & Replace</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Ctrl+F</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMenu === 'view' ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
              }`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 py-1 rounded shadow-lg border z-50 text-xs"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => {
                    toggleSidebar();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--border-focus)]/15"
                >
                  <span>Toggle Explorer</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Ctrl+B</span>
                </button>
                <button
                  onClick={() => {
                    toggleBottomPanel();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--border-focus)]/15"
                >
                  <span>Toggle Bottom Panel</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Ctrl+`</span>
                </button>
                <div className="h-[1px] my-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
                <button
                  onClick={() => {
                    setCommandPaletteOpen(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--border-focus)]/15"
                >
                  <span>Command Palette</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Ctrl+Shift+P</span>
                </button>
              </div>
            )}
          </div>

          {/* Run Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'run' ? null : 'run')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMenu === 'run' ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
              }`}
            >
              Run
            </button>
            {activeMenu === 'run' && (
              <div
                className="absolute top-full left-0 mt-1 w-52 py-1 rounded shadow-lg border z-50 text-xs"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => {
                    runCode();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[var(--border-focus)]/15"
                >
                  <span className="flex items-center gap-2">
                    <Play size={12} className="text-emerald-500" /> Run AXIOM Simulation
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Ctrl+Enter</span>
                </button>
                <button
                  onClick={() => {
                    stepSimulation();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--border-focus)]/15"
                >
                  <StepForward size={12} /> Step Next Tick (⏭)
                </button>
                <button
                  onClick={() => {
                    restartSimulation();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--border-focus)]/15"
                >
                  <RotateCcw size={12} /> Restart Simulation
                </button>
                <button
                  onClick={() => {
                    stopSimulation();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--border-focus)]/15"
                >
                  <Square size={12} /> Stop
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMenu === 'help' ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
              }`}
            >
              Help
            </button>
            {activeMenu === 'help' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 py-1 rounded shadow-lg border z-50 text-xs"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => {
                    onOpenDoc();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--border-focus)]/15"
                >
                  <HelpCircle size={13} /> Learn AXIOM Guide
                </button>
                <button
                  onClick={() => {
                    openWelcomeTab();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-[var(--border-focus)]/15"
                >
                  <Terminal size={13} /> Welcome Screen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Active Model & Run Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}>
          <span className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor:
                simulationState.status === 'running'
                  ? 'var(--status-active)'
                  : simulationState.status === 'completed'
                  ? 'var(--status-qed)'
                  : simulationState.status === 'error'
                  ? 'var(--status-error)'
                  : 'var(--text-muted)',
            }}
          />
          <span>{activeFile ? activeFile.name : 'AXIOM Project'}</span>
        </div>

        {/* Primary Run Button */}
        <button
          onClick={() => runCode()}
          className="h-6 px-2.5 rounded flex items-center gap-1.5 font-medium transition-all cursor-pointer shadow-xs"
          style={{
            backgroundColor: isSimRunning ? 'var(--bg-elevated)' : 'var(--border-focus)',
            color: isSimRunning ? 'var(--text-primary)' : '#ffffff',
            border: isSimRunning ? '1px solid var(--border-subtle)' : 'none',
          }}
          title="Run AXIOM Simulation (Ctrl+Enter)"
        >
          <Play size={11} fill={isSimRunning ? 'none' : 'currentColor'} />
          <span>{isSimRunning ? 'Running...' : 'Run'}</span>
        </button>

        {/* Quick Stepper Controls */}
        <div className="flex items-center border rounded overflow-hidden"
          style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={() => stepSimulation()}
            className="p-1 hover:bg-[var(--bg-elevated)] transition-colors"
            title="Step Next Tick (1 step forward)"
          >
            <StepForward size={12} />
          </button>
          <button
            onClick={() => (isSimRunning ? pauseSimulation() : resumeSimulation())}
            className="p-1 hover:bg-[var(--bg-elevated)] transition-colors"
            title={isSimRunning ? 'Pause' : 'Resume'}
          >
            <Square size={12} />
          </button>
          <button
            onClick={() => restartSimulation()}
            className="p-1 hover:bg-[var(--bg-elevated)] transition-colors"
            title="Restart Simulation"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Right: Theme Toggle, Panel Toggles, Settings */}
      <div className="flex items-center gap-1.5">
        {/* Theme Switcher Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'milky-white' : 'dark')}
          className="flex items-center gap-1.5 px-2 py-1 rounded transition-colors border hover:bg-[var(--bg-elevated)]"
          style={{ borderColor: 'var(--border-subtle)' }}
          title={`Switch to ${theme === 'dark' ? 'Milky White' : 'Eye Protection Black'} theme`}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={12} className="text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Milky White</span>
            </>
          ) : (
            <>
              <Moon size={12} className="text-blue-500" />
              <span className="hidden sm:inline text-[11px]">Obsidian Black</span>
            </>
          )}
        </button>

        {/* Toggle Explorer */}
        <button
          onClick={() => toggleSidebar()}
          className={`p-1.5 rounded border transition-colors ${
            sidebarOpen ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
          }`}
          style={{ borderColor: 'var(--border-subtle)' }}
          title="Toggle Explorer (Ctrl+B)"
        >
          <Sidebar size={13} />
        </button>

        {/* Toggle Bottom Panel */}
        <button
          onClick={() => toggleBottomPanel()}
          className={`p-1.5 rounded border transition-colors ${
            bottomPanelOpen ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'
          }`}
          style={{ borderColor: 'var(--border-subtle)' }}
          title="Toggle Console & Telemetry (Ctrl+`)"
        >
          <PanelBottom size={13} />
        </button>

        {/* Settings button */}
        <button
          onClick={() => setSettingsModalOpen(true)}
          className="p-1.5 rounded border hover:bg-[var(--bg-elevated)] transition-colors"
          style={{ borderColor: 'var(--border-subtle)' }}
          title="Settings"
        >
          <Settings size={13} />
        </button>
      </div>
    </header>
  );
};
