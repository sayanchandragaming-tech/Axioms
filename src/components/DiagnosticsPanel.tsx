import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { AlertCircle, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';

export const DiagnosticsPanel: React.FC = () => {
  const { diagnostics, openFile } = useWorkspace();

  return (
    <div
      className="w-64 border-r flex flex-col h-full select-none text-xs shrink-0 overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div
        className="h-8 px-3 flex items-center justify-between border-b text-[11px] font-semibold tracking-wider uppercase"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <span>Formal Invariants</span>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {diagnostics.length} issues
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 font-mono">
        {diagnostics.length === 0 ? (
          <div className="p-4 text-center text-[var(--text-muted)] flex flex-col items-center gap-2">
            <ShieldCheck size={24} className="text-[var(--status-qed)]" />
            <span>All dimensional units and axiomatic invariants satisfied.</span>
          </div>
        ) : (
          diagnostics.map((diag) => (
            <div
              key={diag.id}
              onClick={() => openFile(diag.fileId)}
              className="p-2 rounded border hover:bg-[var(--bg-elevated)] cursor-pointer flex flex-col gap-1 transition-colors"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 font-semibold">
                  {diag.severity === 'error' ? (
                    <AlertCircle size={12} style={{ color: 'var(--status-error)' }} />
                  ) : (
                    <AlertTriangle size={12} style={{ color: 'var(--status-warning)' }} />
                  )}
                  <span
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
                <span className="text-[var(--text-muted)]">
                  {diag.fileName}:{diag.line}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-primary)]">
                {diag.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
