import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  FilePlus,
  FolderOpen,
  BookOpen,
  ArrowRight,
  Terminal,
  Activity,
  Code2,
  Atom,
  Clock,
  Sparkles,
} from 'lucide-react';

export const WelcomeScreen: React.FC<{ onOpenDoc: () => void }> = ({ onOpenDoc }) => {
  const { createNewFile, openFile, setCommandPaletteOpen, files } = useWorkspace();

  const sampleProjects = [
    {
      name: 'WaterWorld',
      description: 'Thermodynamics, phase transitions, and boiling threshold invariants.',
      targetFile: 'file-main',
      modified: 'Just now',
      tag: 'Thermodynamics',
    },
    {
      name: 'CelestialMechanics',
      description: 'Gravitational field equations and planetary orbital invariants.',
      targetFile: 'file-world',
      modified: '2 hours ago',
      tag: 'Astrophysics',
    },
    {
      name: 'PlantBiosystem',
      description: 'Stomatal conductance, moisture uptake, and biomass kinetics.',
      targetFile: 'file-plant',
      modified: 'Yesterday',
      tag: 'Biophysics',
    },
    {
      name: 'DimensionalConsistency',
      description: 'Formal dimensional analysis testing unit compatibility [L] vs [M].',
      targetFile: 'file-mismatch-demo',
      modified: '3 days ago',
      tag: 'Formal Logic',
    },
  ];

  const shortcuts = [
    { key: 'Ctrl + Enter', label: 'Run AXIOM Simulation' },
    { key: 'Ctrl + S', label: 'Save Active Buffer' },
    { key: 'Ctrl + P', label: 'Quick Open File' },
    { key: 'Ctrl + Shift + P', label: 'Command Palette' },
    { key: 'Ctrl + F', label: 'Find in Code' },
    { key: 'Ctrl + H', label: 'Replace in Code' },
    { key: 'Ctrl + N', label: 'New AXIOM File' },
    { key: 'Ctrl + W', label: 'Close Active Tab' },
    { key: 'Ctrl + B', label: 'Toggle Explorer' },
    { key: 'Ctrl + `', label: 'Toggle Console & Telemetry' },
  ];

  return (
    <div
      className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center justify-start select-none"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="max-w-4xl w-full flex flex-col gap-8">
        {/* Hero Section */}
        <div className="flex flex-col gap-2 border-b pb-6" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-white text-sm"
              style={{ backgroundColor: 'var(--border-focus)' }}
            >
              ∀
            </span>
            <h1 className="text-2xl font-bold tracking-tight">AXIOM Editor</h1>
          </div>
          <p className="text-sm font-medium tracking-wide" style={{ color: 'var(--syntax-keyword)' }}>
            Build logic. Define worlds.
          </p>
          <p className="text-xs leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            A precision scientific computing environment for formal logic, mathematical invariants,
            equations of state, and deterministic world simulation.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <button
              onClick={() => createNewFile()}
              className="h-8 px-3 rounded flex items-center gap-2 text-xs font-medium cursor-pointer shadow-xs transition-colors"
              style={{
                backgroundColor: 'var(--border-focus)',
                color: '#ffffff',
              }}
            >
              <FilePlus size={14} />
              <span>New AXIOM File</span>
            </button>

            <button
              onClick={() => openFile('file-main')}
              className="h-8 px-3 rounded flex items-center gap-2 text-xs font-medium border hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <FolderOpen size={14} />
              <span>Open Project</span>
            </button>

            <button
              onClick={onOpenDoc}
              className="h-8 px-3 rounded flex items-center gap-2 text-xs font-medium hover:bg-[var(--bg-elevated)] cursor-pointer transition-colors text-[var(--syntax-keyword)]"
            >
              <span>Learn AXIOM</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Recent Projects + Essential Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> Recent Models
              </span>
              <span className="text-[10px] font-mono lowercase">.axiom</span>
            </div>

            <div className="flex flex-col gap-2">
              {sampleProjects.map((proj) => (
                <div
                  key={proj.name}
                  onClick={() => openFile(proj.targetFile)}
                  className="p-3 rounded border hover:border-[var(--border-focus)] hover:bg-[var(--bg-elevated)] cursor-pointer transition-all group"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[var(--text-primary)] group-hover:text-[var(--border-focus)] transition-colors">
                      {proj.name}
                    </span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--syntax-keyword)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {proj.tag}
                    </span>
                  </div>
                  <p className="text-[11px] leading-normal text-[var(--text-secondary)]">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Shortcuts */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Terminal size={13} /> Essential Shortcuts
              </span>
              <span className="text-[10px] font-mono">keybindings</span>
            </div>

            <div
              className="rounded border p-2 flex flex-col divide-y divide-[var(--border-subtle)] text-xs font-mono"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {shortcuts.map((sc) => (
                <div
                  key={sc.key}
                  className="flex items-center justify-between py-1.5 px-2 hover:bg-[var(--bg-elevated)] transition-colors"
                >
                  <span className="text-[11px] font-sans text-[var(--text-primary)]">
                    {sc.label}
                  </span>
                  <kbd
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
                    style={{
                      backgroundColor: 'var(--bg-canvas)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--syntax-keyword)',
                    }}
                  >
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scientific Foundations Badge Strip */}
        <div
          className="p-3.5 rounded border text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-[var(--text-secondary)] font-mono text-[11px]"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2">
            <Atom size={16} className="text-[var(--syntax-rule)]" />
            <span>SI Dimensional Invariance Engine · Continuous & Discrete State Scrubber</span>
          </div>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="text-[var(--border-focus)] hover:underline flex items-center gap-1"
          >
            <span>Open Command Palette (Ctrl+Shift+P)</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};
