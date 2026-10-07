import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ShieldCheck, AlertCircle, Cpu, FileCode } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const {
    cursorPosition,
    simulationState,
    activeFile,
    diagnostics,
    settings,
  } = useWorkspace();

  const fileErrors = activeFile
    ? diagnostics.filter((d) => d.fileId === activeFile.id && d.severity === 'error')
    : [];

  return (
    <footer
      className="h-6 px-3 border-t flex items-center justify-between text-[11px] font-mono select-none z-20 shrink-0"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-secondary)',
      }}
    >
      {/* Left: Cursor Position & Project info */}
      <div className="flex items-center gap-3">
        <span className="text-[var(--text-primary)]">
          Ln {cursorPosition.line}, Col {cursorPosition.col}
        </span>

        <span className="h-3 w-[1px] bg-[var(--border-subtle)]" />

        <div className="flex items-center gap-1.5">
          <FileCode size={11} className="text-[var(--border-focus)]" />
          <span>AXIOM Project</span>
        </div>

        <span className="h-3 w-[1px] bg-[var(--border-subtle)]" />

        {/* Diagnostic indicator */}
        {fileErrors.length > 0 ? (
          <span
            className="flex items-center gap-1 font-medium"
            style={{ color: 'var(--status-error)' }}
          >
            <AlertCircle size={11} />
            <span>{fileErrors.length} Diagnostic Error</span>
          </span>
        ) : (
          <span
            className="flex items-center gap-1 text-[var(--status-qed)] font-medium"
          >
            <ShieldCheck size={11} />
            <span>Invariant Verified</span>
          </span>
        )}
      </div>

      {/* Right: Language version, execution state, encoding */}
      <div className="flex items-center gap-3 text-[10px]">
        {/* Runtime State */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
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
          <span className="capitalize">{simulationState.status}</span>
        </div>

        <span className="h-3 w-[1px] bg-[var(--border-subtle)]" />

        {/* Compiler */}
        <span title="AXIOM Compiler Core">AXIOM {settings.compilerVersion}</span>

        <span className="h-3 w-[1px] bg-[var(--border-subtle)]" />

        {/* Units standard */}
        <span title="Physical dimensional system">SI Units</span>

        <span className="h-3 w-[1px] bg-[var(--border-subtle)]" />

        {/* Encoding */}
        <span>UTF-8</span>

        <span className="h-3 w-[1px] bg-[var(--border-subtle)]" />

        {/* Indent */}
        <span>Spaces: {settings.tabSize}</span>
      </div>
    </footer>
  );
};
