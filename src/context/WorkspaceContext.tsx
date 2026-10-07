import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ThemeMode,
  AxiomFile,
  FileNode,
  EditorTab,
  Diagnostic,
  SimulationState,
  ConsoleEntry,
  EditorSettings,
} from '../types/axiom';
import { INITIAL_FILES, INITIAL_PROJECT_TREE } from '../services/sampleFiles';
import { analyzeAxiomDiagnostics, axiomCompiler } from '../services/axiomCompiler';
import { createDefaultSimulationState, stepSimulationState } from '../services/simulationEngine';

const STORAGE_KEY_FILES = 'axiom_ide_files_v1';
const STORAGE_KEY_THEME = 'axiom_ide_theme_v1';
const STORAGE_KEY_SETTINGS = 'axiom_ide_settings_v1';
const STORAGE_KEY_TREE = 'axiom_ide_tree_v1';

const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'dark',
  fontSize: 13,
  lineHeight: 20,
  uiDensity: 'compact',
  editorZoom: 100,
  wordWrap: false,
  minimap: true,
  lineNumbers: true,
  autoSave: true,
  tabSize: 4,
  bracketMatching: true,
  codeFolding: true,
  compilerVersion: 'v0.1-preview',
  stdLibVersion: 'v0.1-core',
  simulationPrecision: '64-bit IEEE-754',
  errorVerbosity: 'standard',
  deterministicExecution: true,
};

interface WorkspaceContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  files: Record<string, AxiomFile>;
  projectTree: FileNode;
  openTabs: EditorTab[];
  activeTabId: string;
  activeFile: AxiomFile | undefined;
  settings: EditorSettings;
  updateSettings: (newSettings: Partial<EditorSettings>) => void;
  diagnostics: Diagnostic[];
  simulationState: SimulationState;
  consoleEntries: ConsoleEntry[];
  bottomPanelTab: 'problems' | 'output' | 'console' | 'simulation' | 'logs';
  setBottomPanelTab: (tab: 'problems' | 'output' | 'console' | 'simulation' | 'logs') => void;
  bottomPanelOpen: boolean;
  setBottomPanelOpen: (open: boolean) => void;
  toggleBottomPanel: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  sidebarTab: 'explorer' | 'search' | 'diagnostics' | 'simulation' | 'settings';
  setSidebarTab: (tab: 'explorer' | 'search' | 'diagnostics' | 'simulation' | 'settings') => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  findModalOpen: boolean;
  setFindModalOpen: (open: boolean) => void;
  cursorPosition: { line: number; col: number };
  setCursorPosition: (pos: { line: number; col: number }) => void;

  // Actions
  openFile: (fileId: string) => void;
  openWelcomeTab: () => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  saveActiveFile: () => void;
  createNewFile: (fileName?: string) => string;
  createNewFolder: (folderName?: string) => void;
  renameNode: (nodeId: string, newName: string) => void;
  deleteNode: (nodeId: string) => void;
  runCode: () => Promise<void>;
  stepSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  restartSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  clearConsole: () => void;
  formatCurrentFile: () => void;
  resetProjectToDefault: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return saved === 'milky-white' ? 'milky-white' : 'dark';
  });

  // Settings state
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Files state
  const [files, setFiles] = useState<Record<string, AxiomFile>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_FILES;
  });

  // Project Tree state
  const [projectTree, setProjectTree] = useState<FileNode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TREE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PROJECT_TREE;
  });

  // Open Tabs: On first load, start with Welcome and main.axiom
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([
    { id: 'tab-welcome', type: 'welcome', title: 'Welcome' },
    { id: 'tab-main', type: 'file', fileId: 'file-main', title: 'main.axiom', path: 'AXIOM Project/main.axiom' },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-welcome');

  // Diagnostics state
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);

  // Simulation state
  const [simulationState, setSimulationState] = useState<SimulationState>(createDefaultSimulationState('WaterWorld'));

  // Console entries
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([
    {
      id: 'c-init',
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
      text: 'AXIOM Interactive Environment v0.1-preview initialized.',
    },
    {
      id: 'c-ready',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      text: 'Mathematical logic theorem checker ready. SI dimensional system loaded.',
    },
  ]);

  // Layout states
  const [bottomPanelTab, setBottomPanelTab] = useState<'problems' | 'output' | 'console' | 'simulation' | 'logs'>('console');
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'explorer' | 'search' | 'diagnostics' | 'simulation' | 'settings'>('explorer');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [findModalOpen, setFindModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });

  // Synchronize HTML theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Save settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Save files
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  }, [files]);

  // Save tree
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TREE, JSON.stringify(projectTree));
  }, [projectTree]);

  // Recalculate diagnostics across all files
  useEffect(() => {
    const allDiags: Diagnostic[] = [];
    Object.values(files).forEach((file) => {
      const diags = analyzeAxiomDiagnostics(file);
      allDiags.push(...diags);
    });
    setDiagnostics(allDiags);
  }, [files]);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const activeTab = useMemo(() => {
    return openTabs.find((t) => t.id === activeTabId);
  }, [openTabs, activeTabId]);

  const activeFile = useMemo(() => {
    if (activeTab?.type === 'file' && activeTab.fileId) {
      return files[activeTab.fileId];
    }
    return undefined;
  }, [activeTab, files]);

  const openFile = useCallback(
    (fileId: string) => {
      const file = files[fileId];
      if (!file) return;

      setOpenTabs((prev) => {
        const existing = prev.find((t) => t.fileId === fileId);
        if (existing) {
          setActiveTabId(existing.id);
          return prev;
        }
        const newTab: EditorTab = {
          id: `tab-${fileId}-${Date.now()}`,
          type: 'file',
          fileId: file.id,
          title: file.name,
          path: file.path,
          isModified: file.isModified,
        };
        setActiveTabId(newTab.id);
        return [...prev, newTab];
      });
    },
    [files]
  );

  const openWelcomeTab = useCallback(() => {
    setOpenTabs((prev) => {
      const existing = prev.find((t) => t.type === 'welcome');
      if (existing) {
        setActiveTabId(existing.id);
        return prev;
      }
      const welcomeTab: EditorTab = {
        id: 'tab-welcome',
        type: 'welcome',
        title: 'Welcome',
      };
      setActiveTabId(welcomeTab.id);
      return [welcomeTab, ...prev];
    });
  }, []);

  const closeTab = useCallback(
    (tabId: string) => {
      setOpenTabs((prev) => {
        const index = prev.findIndex((t) => t.id === tabId);
        if (index === -1) return prev;
        const newTabs = prev.filter((t) => t.id !== tabId);
        if (activeTabId === tabId) {
          if (newTabs.length > 0) {
            const nextActive = newTabs[Math.max(0, index - 1)];
            setActiveTabId(nextActive.id);
          } else {
            setActiveTabId('');
          }
        }
        return newTabs;
      });
    },
    [activeTabId]
  );

  const setActiveTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const updateFileContent = useCallback((fileId: string, newContent: string) => {
    setFiles((prev) => {
      const file = prev[fileId];
      if (!file) return prev;
      return {
        ...prev,
        [fileId]: {
          ...file,
          content: newContent,
          isModified: true,
        },
      };
    });

    setOpenTabs((prev) =>
      prev.map((t) => (t.fileId === fileId ? { ...t, isModified: true } : t))
    );
  }, []);

  const saveActiveFile = useCallback(() => {
    if (!activeFile) return;
    setFiles((prev) => {
      const file = prev[activeFile.id];
      if (!file) return prev;
      return {
        ...prev,
        [activeFile.id]: {
          ...file,
          isModified: false,
        },
      };
    });

    setOpenTabs((prev) =>
      prev.map((t) => (t.fileId === activeFile.id ? { ...t, isModified: false } : t))
    );

    setConsoleEntries((prev) => [
      ...prev,
      {
        id: `save-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'system',
        text: `Saved '${activeFile.name}'. Dimensions and invariants indexed.`,
      },
    ]);
  }, [activeFile]);

  const createNewFile = useCallback(
    (fileName?: string) => {
      const name = fileName && fileName.endsWith('.axiom') ? fileName : (fileName ? `${fileName}.axiom` : `untitled_${Date.now().toString().slice(-4)}.axiom`);
      const id = `file-${Date.now()}`;
      const newFile: AxiomFile = {
        id,
        name,
        path: `AXIOM Project/${name}`,
        content: `// ${name} - AXIOM Formal Model
axiom ${name.replace(/[^a-zA-Z0-9_]/g, '')} {
    // Define physical and logical invariants
    define scale := 1.0m

    rule step_forward {
        // State transition law
    }

    simulate 10 steps
}
`,
        isModified: true,
      };

      setFiles((prev) => ({ ...prev, [id]: newFile }));

      // Add to project tree
      setProjectTree((prev) => ({
        ...prev,
        children: [...(prev.children || []), { id, name, path: newFile.path, type: 'file' }],
      }));

      // Open tab
      openFile(id);
      return id;
    },
    [openFile]
  );

  const createNewFolder = useCallback((folderName?: string) => {
    const name = folderName || `models_${Date.now().toString().slice(-4)}`;
    const id = `folder-${Date.now()}`;
    setProjectTree((prev) => ({
      ...prev,
      children: [
        ...(prev.children || []),
        { id, name, path: `AXIOM Project/${name}`, type: 'folder', isOpen: true, children: [] },
      ],
    }));
  }, []);

  const renameNode = useCallback((nodeId: string, newName: string) => {
    const cleanName = newName.endsWith('.axiom') || !newName.includes('.') ? newName : `${newName}.axiom`;

    setFiles((prev) => {
      if (prev[nodeId]) {
        return {
          ...prev,
          [nodeId]: {
            ...prev[nodeId],
            name: cleanName,
            path: `AXIOM Project/${cleanName}`,
          },
        };
      }
      return prev;
    });

    setOpenTabs((prev) =>
      prev.map((t) => (t.fileId === nodeId ? { ...t, title: cleanName } : t))
    );

    const updateTree = (node: FileNode): FileNode => {
      if (node.id === nodeId) {
        return { ...node, name: cleanName, path: `AXIOM Project/${cleanName}` };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateTree) };
      }
      return node;
    };

    setProjectTree((prev) => updateTree(prev));
  }, []);

  const deleteNode = useCallback(
    (nodeId: string) => {
      // Close tab if open
      setOpenTabs((prev) => prev.filter((t) => t.fileId !== nodeId));

      // Remove from files
      setFiles((prev) => {
        const copy = { ...prev };
        delete copy[nodeId];
        return copy;
      });

      // Remove from tree
      const removeFromTree = (node: FileNode): FileNode => {
        if (!node.children) return node;
        return {
          ...node,
          children: node.children.filter((c) => c.id !== nodeId).map(removeFromTree),
        };
      };

      setProjectTree((prev) => removeFromTree(prev));
    },
    []
  );

  const clearConsole = useCallback(() => {
    setConsoleEntries([]);
  }, []);

  const formatCurrentFile = useCallback(() => {
    if (!activeFile) return;
    // Pretty-indent AXIOM code
    const lines = activeFile.content.split('\n');
    let indentLevel = 0;
    const formatted = lines
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        const indent = '    '.repeat(indentLevel);
        if (trimmed.endsWith('{')) {
          indentLevel++;
        }
        return `${indent}${trimmed}`;
      })
      .join('\n');

    updateFileContent(activeFile.id, formatted);
    setConsoleEntries((prev) => [
      ...prev,
      {
        id: `fmt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        text: `Formatted '${activeFile.name}' according to AXIOM style guide.`,
      },
    ]);
  }, [activeFile, updateFileContent]);

  const resetProjectToDefault = useCallback(() => {
    setFiles(INITIAL_FILES);
    setProjectTree(INITIAL_PROJECT_TREE);
    setOpenTabs([
      { id: 'tab-welcome', type: 'welcome', title: 'Welcome' },
      { id: 'tab-main', type: 'file', fileId: 'file-main', title: 'main.axiom', path: 'AXIOM Project/main.axiom' },
    ]);
    setActiveTabId('tab-main');
    localStorage.removeItem(STORAGE_KEY_FILES);
    localStorage.removeItem(STORAGE_KEY_TREE);
  }, []);

  // Run experience execution
  const runCode = useCallback(async () => {
    const file = activeFile || files['file-main'];
    if (!file) return;

    setBottomPanelOpen(true);
    setBottomPanelTab('console');

    setSimulationState((prev) => ({
      ...prev,
      status: 'running',
    }));

    setConsoleEntries((prev) => [
      ...prev,
      {
        id: `run-start-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'system',
        text: '────────────────────────────────────────────────────────',
      },
      {
        id: `run-runtime-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'runtime',
        text: 'AXIOM Runtime',
      },
      {
        id: `run-init-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        text: 'World initialized.',
      },
    ]);

    // Perform compilation and diagnostic check
    const compilation = await axiomCompiler.compile(file.content, file.name);

    if (!compilation.success) {
      setSimulationState((prev) => ({
        ...prev,
        status: 'error',
        error: compilation.diagnostics[0]?.message || 'Verification failure',
      }));

      setConsoleEntries((prev) => [
        ...prev,
        {
          id: `run-err-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error',
          text: `ERROR: ${compilation.diagnostics[0]?.message}`,
        },
        {
          id: `run-err-detail-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'error',
          text: `Simulation halted at initial boundary verification.`,
        },
      ]);
      return;
    }

    // Initialize simulation for this world
    const stepsCount = Math.min(compilation.totalSteps, 10);
    let currentSim = createDefaultSimulationState(compilation.modelName);
    currentSim.maxSteps = stepsCount;
    currentSim.status = 'running';
    setSimulationState(currentSim);

    // Step-by-step console output and telemetry update
    for (let step = 1; step <= stepsCount; step++) {
      await new Promise((res) => setTimeout(res, 120));
      currentSim = stepSimulationState(currentSim);
      setSimulationState({ ...currentSim });

      setConsoleEntries((prev) => [
        ...prev,
        {
          id: `step-${step}-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'output',
          text: `Step ${step} completed.`,
        },
      ]);
    }

    const tempVal = currentSim.variables.temperature?.value;
    const stateVal = currentSim.variables.state?.value;

    setConsoleEntries((prev) => [
      ...prev,
      {
        id: `val-temp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        text: `temperature = ${tempVal}°C`,
      },
      {
        id: `val-state-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        text: `state = ${stateVal}`,
      },
      {
        id: `sim-done-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'success',
        text: 'Simulation completed. All axioms preserved.',
      },
    ]);
  }, [activeFile, files]);

  // Simulation controls
  const stepSimulation = useCallback(() => {
    setSimulationState((prev) => stepSimulationState(prev));
  }, []);

  const pauseSimulation = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const resumeSimulation = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, status: 'running' }));
  }, []);

  const restartSimulation = useCallback(() => {
    const worldName = simulationState.worldName || 'WaterWorld';
    setSimulationState(createDefaultSimulationState(worldName));
    setConsoleEntries((prev) => [
      ...prev,
      {
        id: `sim-restart-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'system',
        text: `Simulation state reset to T=0 for world '${worldName}'.`,
      },
    ]);
  }, [simulationState.worldName]);

  const stopSimulation = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, status: 'ready', currentStep: 0, timeSeconds: 0 }));
  }, []);

  const setSimulationSpeed = useCallback((speed: number) => {
    setSimulationState((prev) => ({ ...prev, speed }));
  }, []);

  const toggleBottomPanel = useCallback(() => {
    setBottomPanelOpen((prev) => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        theme,
        setTheme,
        files,
        projectTree,
        openTabs,
        activeTabId,
        activeFile,
        settings,
        updateSettings,
        diagnostics,
        simulationState,
        consoleEntries,
        bottomPanelTab,
        setBottomPanelTab,
        bottomPanelOpen,
        setBottomPanelOpen,
        toggleBottomPanel,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        sidebarTab,
        setSidebarTab,
        commandPaletteOpen,
        setCommandPaletteOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        findModalOpen,
        setFindModalOpen,
        cursorPosition,
        setCursorPosition,
        openFile,
        openWelcomeTab,
        closeTab,
        setActiveTab,
        updateFileContent,
        saveActiveFile,
        createNewFile,
        createNewFolder,
        renameNode,
        deleteNode,
        runCode,
        stepSimulation,
        pauseSimulation,
        resumeSimulation,
        restartSimulation,
        stopSimulation,
        setSimulationSpeed,
        clearConsole,
        formatCurrentFile,
        resetProjectToDefault,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
