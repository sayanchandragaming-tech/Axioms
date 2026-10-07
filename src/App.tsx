import React, { useState, useEffect } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { TopBar } from './components/TopBar';
import { ActivityBar } from './components/ActivityBar';
import { Explorer } from './components/Explorer';
import { SearchPanel } from './components/SearchPanel';
import { DiagnosticsPanel } from './components/DiagnosticsPanel';
import { TabBar } from './components/TabBar';
import { AxiomEditor } from './components/AxiomEditor';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BottomPanel } from './components/BottomPanel';
import { StatusBar } from './components/StatusBar';
import { CommandPalette } from './components/CommandPalette';
import { QuickOpen } from './components/QuickOpen';
import { FindReplaceModal } from './components/FindReplaceModal';
import { SettingsModal } from './components/SettingsModal';
import { DocumentationModal } from './components/DocumentationModal';
import { SimulationView } from './components/SimulationView';

const IDEWorkspace: React.FC = () => {
  const {
    openTabs,
    activeTabId,
    sidebarOpen,
    sidebarTab,
    runCode,
    saveActiveFile,
    createNewFile,
    closeTab,
    toggleSidebar,
    toggleBottomPanel,
    setCommandPaletteOpen,
    setFindModalOpen,
  } = useWorkspace();

  const [quickOpenVisible, setQuickOpenVisible] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);

  // Global Keyboard Shortcuts handler (cross-platform: Ctrl and Cmd)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      // 1. Run: Ctrl + Enter
      if (isCmdOrCtrl && e.key === 'Enter') {
        e.preventDefault();
        runCode();
        return;
      }

      // 2. Save: Ctrl + S
      if (isCmdOrCtrl && e.key.toLowerCase() === 's' && !e.shiftKey) {
        e.preventDefault();
        saveActiveFile();
        return;
      }

      // 3. Command Palette: Ctrl + Shift + P
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // 4. Quick Open: Ctrl + P (without shift)
      if (isCmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setQuickOpenVisible(true);
        return;
      }

      // 5. Find: Ctrl + F
      if (isCmdOrCtrl && e.key.toLowerCase() === 'f' && !e.shiftKey) {
        e.preventDefault();
        setFindModalOpen(true);
        return;
      }

      // 6. Replace: Ctrl + H
      if (isCmdOrCtrl && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setFindModalOpen(true);
        return;
      }

      // 7. New AXIOM File: Ctrl + N
      if (isCmdOrCtrl && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNewFile();
        return;
      }

      // 8. Close Active Tab: Ctrl + W
      if (isCmdOrCtrl && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (activeTabId) {
          closeTab(activeTabId);
        }
        return;
      }

      // 9. Toggle Explorer: Ctrl + B
      if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // 10. Toggle Console / Bottom Panel: Ctrl + `
      if (isCmdOrCtrl && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault();
        toggleBottomPanel();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    runCode,
    saveActiveFile,
    createNewFile,
    activeTabId,
    closeTab,
    toggleSidebar,
    toggleBottomPanel,
    setCommandPaletteOpen,
    setFindModalOpen,
  ]);

  const activeTab = openTabs.find((t) => t.id === activeTabId);

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden text-xs select-none"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Application Bar */}
      <TopBar onOpenDoc={() => setDocModalOpen(true)} />

      {/* Main Workbench Body: Activity Bar + Sidebar + Center Editor Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Activity Bar Rail */}
        <ActivityBar onOpenDoc={() => setDocModalOpen(true)} />

        {/* Collapsible Sidebar */}
        {sidebarOpen && (
          <aside className="shrink-0 flex h-full">
            {sidebarTab === 'explorer' && <Explorer />}
            {sidebarTab === 'search' && <SearchPanel />}
            {sidebarTab === 'diagnostics' && <DiagnosticsPanel />}
            {sidebarTab === 'simulation' && (
              <div
                className="w-72 border-r p-3 overflow-y-auto"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <SimulationView />
              </div>
            )}
          </aside>
        )}

        {/* Center Editor Container */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
          {/* Tab Strip */}
          <TabBar />

          {/* Active Canvas / Editor Content */}
          <div className="flex-1 flex overflow-hidden relative">
            {activeTab?.type === 'welcome' ? (
              <WelcomeScreen onOpenDoc={() => setDocModalOpen(true)} />
            ) : activeTab?.type === 'file' ? (
              <AxiomEditor />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
                <span className="font-mono text-sm">No editor tab active.</span>
                <span className="text-xs">Press Ctrl+P to quick open or Ctrl+N to create a new file.</span>
              </div>
            )}

            {/* Find & Replace Popover widget */}
            <FindReplaceModal />
          </div>

          {/* Bottom Drawer (Problems, Output, Console, Simulation, Logs) */}
          <BottomPanel />
        </main>
      </div>

      {/* Fixed Bottom Status Bar */}
      <StatusBar />

      {/* Global Modals & Palettes */}
      <CommandPalette onOpenDoc={() => setDocModalOpen(true)} />
      <QuickOpen isOpen={quickOpenVisible} onClose={() => setQuickOpenVisible(false)} />
      <SettingsModal />
      <DocumentationModal isOpen={docModalOpen} onClose={() => setDocModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <IDEWorkspace />
    </WorkspaceProvider>
  );
}
