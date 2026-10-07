import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  AlertCircle,
  AlertTriangle,
  Terminal,
  Activity,
  FileText,
  Trash2,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { SimulationView } from './SimulationView';

export const BottomPanel: React.FC = () => {
  const {
    bottomPanelOpen,
    setBottomPanelOpen,
    bottomPanelTab,
    setBottomPanelTab,
    diagnostics,
    consoleEntries,
    clearConsole,
    openFile,
    simulationState,
  } = useWorkspace();

  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!bottomPanelOpen) return null;

  const errorCount = diagnostics.filter((d) => d.severity === 'error').length;
  const warnCount = diagnostics.filter((d) => d.severity === 'warning').length;

  return (
    <div
      className={`border-t flex flex-col select-none transition-all duration-150 z-20 shrink-0 ${
        isExpanded ? 'h-80' : 'h-52'
      }`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Panel Tab Header */}
      <div
        className="h-8 px-3 border-b flex items-center justify-between text-xs font-medium"
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-canvas)',
        }}
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {/* Problems */}
          <button
            onClick={() => setBottomPanelTab('problems')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] font-mono ${
              bottomPanelTab === 'problems'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Problems</span>
            {errorCount + warnCount > 0 && (
              <span
                className="px-1.5 py-0.2 rounded text-[10px]"
                style={{
                  backgroundColor: errorCount > 0 ? 'var(--status-error)' : 'var(--status-warning)',
                  color: '#ffffff',
                }}
              >
                {errorCount + warnCount}
              </span>
            )}
          </button>

          {/* Output */}
          <button
            onClick={() => setBottomPanelTab('output')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] font-mono ${
              bottomPanelTab === 'output'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Output</span>
          </button>

          {/* AXIOM Console */}
          <button
            onClick={() => setBottomPanelTab('console')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] font-mono ${
              bottomPanelTab === 'console'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Terminal size={12} className="text-[var(--border-focus)]" />
            <span>AXIOM Console</span>
            {simulationState.status === 'running' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            )}
          </button>

          {/* Simulation */}
          <button
            onClick={() => setBottomPanelTab('simulation')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] font-mono ${
              bottomPanelTab === 'simulation'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Activity size={12} className="text-[var(--syntax-rule)]" />
            <span>Simulation Telemetry</span>
          </button>

          {/* Logs */}
          <button
            onClick={() => setBottomPanelTab('logs')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] font-mono ${
              bottomPanelTab === 'logs'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>System Logs</span>
          </button>
        </div>

        {/* Panel Actions */}
        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          {bottomPanelTab === 'console' && (
            <button
              onClick={clearConsole}
              className="p-1 rounded hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
              title="Clear Console"
            >
              <Trash2 size={12} />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
            title={isExpanded ? 'Restore Panel Height' : 'Maximize Panel'}
          >
            {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>

          <button
            onClick={() => setBottomPanelOpen(false)}
            className="p-1 rounded hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
            title="Close Panel (Ctrl+`)"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Panel Body Content */}
      <div className="flex-1 overflow-auto p-2 text-xs font-mono">
        {/* Problems View */}
        {bottomPanelTab === 'problems' && (
          <div className="flex flex-col gap-1.5">
            {diagnostics.length === 0 ? (
              <div className="text-[var(--text-muted)] py-4 text-center">
                No formal logic, syntax, or dimensional violations found.
              </div>
            ) : (
              diagnostics.map((diag) => (
                <div
                  key={diag.id}
                  onClick={() => openFile(diag.fileId)}
                  className="p-2 rounded border flex flex-col gap-1 cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {diag.severity === 'error' ? (
                        <AlertCircle size={13} style={{ color: 'var(--status-error)' }} />
                      ) : (
                        <AlertTriangle size={13} style={{ color: 'var(--status-warning)' }} />
                      )}
                      <span
                        className="font-semibold uppercase tracking-wider text-[10px]"
                        style={{
                          color:
                            diag.severity === 'error'
                              ? 'var(--status-error)'
                              : 'var(--status-warning)',
                        }}
                      >
                        {diag.category}
                      </span>
                    </div>

                    <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                      <span>{diag.fileName}</span>
                      <span>[{diag.line}:{diag.column}]</span>
                      <ExternalLink size={10} />
                    </div>
                  </div>

                  <div className="text-[var(--text-primary)] font-mono text-[11px]">
                    {diag.message}
                  </div>

                  {diag.explanation && (
                    <div className="text-[10px] text-[var(--text-secondary)] font-sans">
                      {diag.explanation}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Output View */}
        {bottomPanelTab === 'output' && (
          <div className="flex flex-col gap-1 text-[var(--text-secondary)]">
            <div className="text-[var(--text-primary)] font-semibold mb-1">
              [AXIOM Verification & Compilation Engine]
            </div>
            <div>[Model Parser] Loaded formal AST schema. Version 0.1-preview.</div>
            <div>[Dimensional Solver] Standard SI System: [L, M, T, Θ, N, I, J] verified.</div>
            <div>[Invariant Monitor] Continuous state assertions enabled with IEEE 754 precision.</div>
            <div className="text-[var(--syntax-keyword)]">Ready to simulate.</div>
          </div>
        )}

        {/* AXIOM Console View */}
        {bottomPanelTab === 'console' && (
          <div className="flex flex-col gap-1">
            {consoleEntries.map((entry) => {
              let color = 'var(--text-primary)';
              if (entry.type === 'runtime') color = 'var(--syntax-keyword)';
              if (entry.type === 'output') color = 'var(--syntax-rule)';
              if (entry.type === 'error') color = 'var(--status-error)';
              if (entry.type === 'success') color = 'var(--status-qed)';
              if (entry.type === 'system') color = 'var(--text-muted)';

              return (
                <div key={entry.id} className="flex items-start gap-2.5 leading-snug">
                  <span className="text-[10px] text-[var(--text-muted)] shrink-0 select-none">
                    {entry.timestamp}
                  </span>
                  <span style={{ color }} className="font-mono text-[11px] whitespace-pre-wrap">
                    {entry.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Simulation Telemetry View */}
        {bottomPanelTab === 'simulation' && <SimulationView />}

        {/* System Logs View */}
        {bottomPanelTab === 'logs' && (
          <div className="flex flex-col gap-1 text-[11px] text-[var(--text-secondary)]">
            <div>[IDE Engine] Initialized workspace buffer pool.</div>
            <div>[Storage] Synced local session storage with active models.</div>
            <div>[Keymap] Bound IDE accelerator keys (Ctrl+Enter, Ctrl+S, Ctrl+P, etc.).</div>
            <div>[Memory] Telemetry ring buffer initialized (size: 1024 steps).</div>
          </div>
        )}
      </div>
    </div>
  );
};
