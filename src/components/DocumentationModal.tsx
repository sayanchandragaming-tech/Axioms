import React from 'react';
import { X, BookOpen, Atom, ArrowRight } from 'lucide-react';

export const DocumentationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl h-[560px] rounded-lg border shadow-2xl flex flex-col overflow-hidden text-xs"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="h-10 px-4 border-b flex items-center justify-between text-xs font-semibold shrink-0"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[var(--border-focus)]" />
            <span>Learn AXIOM: Scientific & Formal Language Reference</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 select-text font-sans">
          {/* Overview */}
          <div>
            <h2 className="text-base font-bold mb-1">Introduction to AXIOM</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              AXIOM is a formal programming language tailored for mathematics, formal logic, axioms,
              physical definitions, and deterministic world modeling. Unlike general-purpose languages,
              AXIOM treats physical units as first-class dimensional invariants and enforces conservation laws.
            </p>
          </div>

          {/* Grammar primitives */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--syntax-keyword)]">
              Core Language Constructs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-subtle)' }}>
                <span className="font-mono font-bold text-[var(--syntax-keyword)] block mb-1">
                  axiom SystemName &#123; ... &#125;
                </span>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Declares an axiomatic world boundary. All rules and invariants within this scope are evaluated together.
                </p>
              </div>

              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-subtle)' }}>
                <span className="font-mono font-bold text-[var(--syntax-definition)] block mb-1">
                  define constant := value
                </span>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Defines an immutable mathematical constant or boundary condition with exact physical units.
                </p>
              </div>

              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-subtle)' }}>
                <span className="font-mono font-bold text-[var(--syntax-rule)] block mb-1">
                  rule transition &#123; ... &#125;
                </span>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Inductive state transition law executed once per discrete simulation tick.
                </p>
              </div>

              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-subtle)' }}>
                <span className="font-mono font-bold text-[var(--syntax-logic)] block mb-1">
                  when condition &#123; ... &#125;
                </span>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Discrete trigger fired only when the mathematical inequality or propositional state becomes true.
                </p>
              </div>
            </div>
          </div>

          {/* Physical Units */}
          <div>
            <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--syntax-unit)] mb-2">
              Dimensional Consistency & SI Units
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
              AXIOM performs dimensional homogeneity checking. Quantities with different dimensions (e.g. Length <code className="font-mono">[L]</code> and Mass <code className="font-mono">[M]</code>) cannot be summed:
            </p>

            <div className="p-3 rounded border font-mono text-xs" style={{ backgroundColor: 'var(--bg-canvas)', borderColor: 'var(--border-subtle)' }}>
              <div className="text-[var(--status-error)] mb-1">// ❌ Dimensional Contradiction Error</div>
              <div>total := 10m + 5kg;  // Error: cannot add length [L] with mass [M]</div>
              <div className="text-[var(--status-qed)] mt-2 mb-1">// ✅ Dimensionally Homogeneous</div>
              <div>work := 10N * 5m;    // Valid: yields 50J [M·L²·T⁻²]</div>
            </div>
          </div>

          {/* Invariants & QED */}
          <div>
            <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--status-qed)] mb-2">
              Invariants & Q.E.D. Proofs
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Use the <code className="font-mono text-[var(--syntax-keyword)]">invariant</code> keyword to assert universal laws that must hold true at every single time tick. If an invariant is violated, the simulation halts and flags a formal diagnostic.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-3 border-t flex justify-end"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-canvas)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-white font-medium"
            style={{ backgroundColor: 'var(--border-focus)' }}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
