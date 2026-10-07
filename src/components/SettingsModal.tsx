import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  X,
  Palette,
  Sliders,
  Cpu,
  Keyboard,
  Check,
  RotateCcw,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    settingsModalOpen,
    setSettingsModalOpen,
    settings,
    updateSettings,
    theme,
    setTheme,
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'appearance' | 'editor' | 'axiom' | 'keyboard'>('appearance');

  if (!settingsModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={() => setSettingsModalOpen(false)}
    >
      <div
        className="w-full max-w-2xl h-[520px] rounded-lg border shadow-2xl flex flex-col overflow-hidden text-xs"
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
            <span>Settings</span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">AXIOM IDE</span>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content Body: Left Tabs + Right Settings Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Settings Navigation Tabs */}
          <div
            className="w-44 border-r py-2 flex flex-col gap-0.5 shrink-0"
            style={{
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'var(--bg-canvas)',
            }}
          >
            <button
              onClick={() => setActiveTab('appearance')}
              className={`px-3 py-2 text-left flex items-center gap-2 text-xs transition-colors ${
                activeTab === 'appearance'
                  ? 'bg-[var(--bg-elevated)] text-[var(--border-focus)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
              }`}
            >
              <Palette size={14} />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-2 text-left flex items-center gap-2 text-xs transition-colors ${
                activeTab === 'editor'
                  ? 'bg-[var(--bg-elevated)] text-[var(--border-focus)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
              }`}
            >
              <Sliders size={14} />
              <span>Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('axiom')}
              className={`px-3 py-2 text-left flex items-center gap-2 text-xs transition-colors ${
                activeTab === 'axiom'
                  ? 'bg-[var(--bg-elevated)] text-[var(--border-focus)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
              }`}
            >
              <Cpu size={14} />
              <span>AXIOM Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('keyboard')}
              className={`px-3 py-2 text-left flex items-center gap-2 text-xs transition-colors ${
                activeTab === 'keyboard'
                  ? 'bg-[var(--bg-elevated)] text-[var(--border-focus)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
              }`}
            >
              <Keyboard size={14} />
              <span>Shortcuts</span>
            </button>
          </div>

          {/* Right Pane Form */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="font-semibold text-sm mb-1">Color Theme</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mb-3">
                    Choose between scientific soft milky parchment or low-glare obsidian slate.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setTheme('dark')}
                      className={`p-3 rounded border cursor-pointer flex flex-col gap-2 transition-all ${
                        theme === 'dark'
                          ? 'border-[var(--border-focus)] ring-1 ring-[var(--border-focus)] bg-[#131518]'
                          : 'border-[var(--border-subtle)] bg-[#131518]/70 hover:border-[var(--text-muted)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#d6dbe2]">Eye Protection Black</span>
                        {theme === 'dark' && <Check size={13} className="text-[#3e82f7]" />}
                      </div>
                      <span className="text-[10px] text-[#9eacb9]">
                        Obsidian slate, non-reflective, optimal for extended mathematical proof sessions.
                      </span>
                    </div>

                    <div
                      onClick={() => setTheme('milky-white')}
                      className={`p-3 rounded border cursor-pointer flex flex-col gap-2 transition-all ${
                        theme === 'milky-white'
                          ? 'border-[#205493] ring-1 ring-[#205493] bg-[#f7f6f2]'
                          : 'border-[var(--border-subtle)] bg-[#f7f6f2]/80 hover:border-[var(--text-muted)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#1e232a]">Milky White</span>
                        {theme === 'milky-white' && <Check size={13} className="text-[#205493]" />}
                      </div>
                      <span className="text-[10px] text-[#495361]">
                        Parchment-like soft ivory, high contrast without bright blinding white.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 border-[var(--border-subtle)] flex flex-col gap-4">
                  {/* Font Size */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold block">Font Size</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        Editor JetBrains Mono size in pixels
                      </span>
                    </div>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                      className="px-2 py-1 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    >
                      {[11, 12, 13, 14, 16].map((s) => (
                        <option key={s} value={s}>
                          {s}px
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Line Height */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold block">Line Height</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        Vertical row clearance for sub/superscripts
                      </span>
                    </div>
                    <select
                      value={settings.lineHeight}
                      onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
                      className="px-2 py-1 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    >
                      {[18, 20, 22, 24].map((s) => (
                        <option key={s} value={s}>
                          {s}px
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* UI Density */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold block">UI Density</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        Layout gutter and panel spacing
                      </span>
                    </div>
                    <select
                      value={settings.uiDensity}
                      onChange={(e) => updateSettings({ uiDensity: e.target.value as any })}
                      className="px-2 py-1 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    >
                      <option value="compact">Compact (Standard IDE)</option>
                      <option value="comfortable">Comfortable</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Editor Tab */}
            {activeTab === 'editor' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-sm">Editor Preferences</h3>

                <label className="flex items-center justify-between py-1 cursor-pointer">
                  <div>
                    <span className="font-medium block">Line Numbers</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Show numeric line gutter with diagnostic flags
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.lineNumbers}
                    onChange={(e) => updateSettings({ lineNumbers: e.target.checked })}
                    className="accent-[var(--border-focus)]"
                  />
                </label>

                <label className="flex items-center justify-between py-1 cursor-pointer">
                  <div>
                    <span className="font-medium block">Code Minimap</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Display miniaturized high-level code overview on the right
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.minimap}
                    onChange={(e) => updateSettings({ minimap: e.target.checked })}
                    className="accent-[var(--border-focus)]"
                  />
                </label>

                <label className="flex items-center justify-between py-1 cursor-pointer">
                  <div>
                    <span className="font-medium block">Word Wrap</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Wrap long lines to fit editor viewport
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.wordWrap}
                    onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
                    className="accent-[var(--border-focus)]"
                  />
                </label>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="font-medium block">Tab Indentation</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Number of spaces per mathematical block indentation
                    </span>
                  </div>
                  <select
                    value={settings.tabSize}
                    onChange={(e) => updateSettings({ tabSize: Number(e.target.value) })}
                    className="px-2 py-1 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </div>
              </div>
            )}

            {/* AXIOM Engine Tab */}
            {activeTab === 'axiom' && (
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold text-sm">AXIOM Formal Engine</h3>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="font-medium block">Compiler Toolchain</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Active formal logic verifier version
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[var(--syntax-keyword)]">
                    {settings.compilerVersion}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="font-medium block">Standard Library</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Core thermodynamic and physical constants
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[var(--syntax-rule)]">
                    {settings.stdLibVersion}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <span className="font-medium block">Simulation Precision</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Floating-point evaluation standard
                    </span>
                  </div>
                  <select
                    value={settings.simulationPrecision}
                    onChange={(e) => updateSettings({ simulationPrecision: e.target.value })}
                    className="px-2 py-1 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  >
                    <option value="64-bit IEEE-754">64-bit Double (IEEE 754)</option>
                    <option value="Arbitrary Rational">Arbitrary Rational (Exact Fractions)</option>
                  </select>
                </div>

                <label className="flex items-center justify-between py-1 cursor-pointer">
                  <div>
                    <span className="font-medium block">Deterministic Execution</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Ensure reproducible state trajectories across restarts
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.deterministicExecution}
                    onChange={(e) => updateSettings({ deterministicExecution: e.target.checked })}
                    className="accent-[var(--border-focus)]"
                  />
                </label>
              </div>
            )}

            {/* Shortcuts Tab */}
            {activeTab === 'keyboard' && (
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-sm">Keyboard Shortcuts</h3>
                <div
                  className="rounded border p-2 flex flex-col divide-y divide-[var(--border-subtle)] text-xs font-mono"
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  {[
                    ['Run Simulation', 'Ctrl + Enter'],
                    ['Save File', 'Ctrl + S'],
                    ['Quick Open File', 'Ctrl + P'],
                    ['Command Palette', 'Ctrl + Shift + P'],
                    ['Find in Code', 'Ctrl + F'],
                    ['Replace in Code', 'Ctrl + H'],
                    ['New File', 'Ctrl + N'],
                    ['Close Tab', 'Ctrl + W'],
                    ['Toggle Explorer', 'Ctrl + B'],
                    ['Toggle Console', 'Ctrl + `'],
                    ['Format Code', 'Shift + Alt + F'],
                  ].map(([label, kbd]) => (
                    <div key={label} className="flex items-center justify-between py-1.5 px-2">
                      <span className="text-[11px] font-sans text-[var(--text-primary)]">
                        {label}
                      </span>
                      <kbd
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--syntax-keyword)',
                        }}
                      >
                        {kbd}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
