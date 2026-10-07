export type ThemeMode = 'dark' | 'milky-white';

export interface AxiomFile {
  id: string;
  name: string;
  path: string;
  content: string;
  isModified?: boolean;
  isReadOnly?: boolean;
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

export interface EditorTab {
  id: string;
  type: 'file' | 'welcome';
  fileId?: string;
  title: string;
  path?: string;
  isModified?: boolean;
}

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface Diagnostic {
  id: string;
  fileId: string;
  fileName: string;
  line: number;
  column: number;
  message: string;
  severity: DiagnosticSeverity;
  category: 'Syntax Error' | 'Undefined Symbol' | 'Type Error' | 'Unit Mismatch' | 'Invalid Rule' | 'Contradictory Condition' | 'Invariant Warning';
  sourceText?: string;
  explanation?: string;
}

export interface InvariantStatus {
  id: string;
  name: string;
  formula: string;
  satisfied: boolean;
  description: string;
}

export interface VariableTelemetry {
  name: string;
  value: string | number;
  unit?: string;
  type: string;
  history?: number[];
}

export interface SimulationState {
  status: 'ready' | 'running' | 'paused' | 'completed' | 'error';
  worldName: string;
  currentStep: number;
  maxSteps: number;
  timeSeconds: number;
  speed: number;
  variables: Record<string, VariableTelemetry>;
  invariants: InvariantStatus[];
  error?: string;
}

export interface ConsoleEntry {
  id: string;
  timestamp: string;
  type: 'system' | 'runtime' | 'output' | 'success' | 'warning' | 'error' | 'info';
  text: string;
}

export interface EditorSettings {
  // Appearance
  theme: ThemeMode;
  fontSize: number;
  lineHeight: number;
  uiDensity: 'compact' | 'comfortable';
  editorZoom: number;

  // Editor
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
  tabSize: number;
  bracketMatching: boolean;
  codeFolding: boolean;

  // AXIOM Engine
  compilerVersion: string;
  stdLibVersion: string;
  simulationPrecision: string;
  errorVerbosity: 'minimal' | 'standard' | 'verbose';
  deterministicExecution: boolean;
}

export interface AutocompleteSuggestion {
  label: string;
  kind: 'keyword' | 'property' | 'unit' | 'operator' | 'type' | 'constant';
  detail: string;
  unitOrType?: string;
  insertText?: string;
  documentation?: string;
}
