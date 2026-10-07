import React, { useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Square,
  CheckCircle2,
  AlertCircle,
  Activity,
  Gauge,
  Sliders,
} from 'lucide-react';

export const SimulationView: React.FC = () => {
  const {
    simulationState,
    stepSimulation,
    pauseSimulation,
    resumeSimulation,
    restartSimulation,
    stopSimulation,
    setSimulationSpeed,
  } = useWorkspace();

  const isRunning = simulationState.status === 'running';

  // Periodic ticker when running
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      const delay = Math.max(50, 400 / (simulationState.speed || 1));
      interval = setInterval(() => {
        stepSimulation();
      }, delay);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, simulationState.speed, stepSimulation]);

  return (
    <div className="flex flex-col gap-3 font-mono text-xs select-none">
      {/* Top Simulation Status & World Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded border"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: 'var(--border-subtle)',
        }}>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase block">World Model</span>
            <span className="font-semibold text-[13px] text-[var(--text-primary)]">
              {simulationState.worldName}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-[var(--border-subtle)]" />

          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase block">Execution Status</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
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
              <span className="font-medium capitalize text-[var(--text-primary)]">
                {simulationState.status}
              </span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[var(--border-subtle)]" />

          <div>
            <span className="text-[10px] text-[var(--text-muted)] uppercase block">Time / Step</span>
            <span className="text-[var(--text-primary)] font-semibold">
              T = {simulationState.timeSeconds.toFixed(2)}s · Step {simulationState.currentStep} / {simulationState.maxSteps}
            </span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          {isRunning ? (
            <button
              onClick={pauseSimulation}
              className="px-2.5 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] flex items-center gap-1.5 transition-colors"
              title="Pause Simulation"
            >
              <Pause size={12} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={resumeSimulation}
              className="px-2.5 py-1 rounded bg-[var(--border-focus)] text-white hover:opacity-90 flex items-center gap-1.5 transition-opacity"
              title="Resume Simulation"
            >
              <Play size={12} fill="currentColor" />
              <span>Play</span>
            </button>
          )}

          <button
            onClick={stepSimulation}
            className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] transition-colors"
            title="Step 1 Tick"
          >
            <StepForward size={13} />
          </button>

          <button
            onClick={restartSimulation}
            className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] transition-colors"
            title="Restart to T=0"
          >
            <RotateCcw size={13} />
          </button>

          <button
            onClick={stopSimulation}
            className="p-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] transition-colors"
            title="Stop"
          >
            <Square size={13} />
          </button>

          {/* Speed selector */}
          <div className="flex items-center ml-2 border rounded overflow-hidden"
            style={{ borderColor: 'var(--border-subtle)' }}>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-1.5 py-0.5 text-[10px] transition-colors ${
                  simulationState.speed === spd
                    ? 'bg-[var(--border-focus)] text-white font-bold'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Timeline Scrubber Bar */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[var(--text-muted)]">0</span>
        <div className="flex-1 h-2 rounded bg-[var(--bg-canvas)] border border-[var(--border-subtle)] overflow-hidden relative">
          <div
            className="h-full transition-all duration-150"
            style={{
              width: `${(simulationState.currentStep / simulationState.maxSteps) * 100}%`,
              backgroundColor: 'var(--border-focus)',
            }}
          />
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">{simulationState.maxSteps}</span>
      </div>

      {/* Grid: Live Telemetry Variables & Mathematical Invariants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Variables Cards */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] tracking-wider">
            State Variables Telemetry
          </span>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(simulationState.variables).map(([key, variable]) => (
              <div
                key={key}
                className="p-2 rounded border flex flex-col justify-between"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <span className="text-[10px] text-[var(--text-muted)] truncate">
                  {variable.name}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {variable.value}
                  </span>
                  {variable.unit && (
                    <span className="text-[11px] text-[var(--syntax-unit)] font-medium">
                      {variable.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mathematical Invariants */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] tracking-wider">
            Axiomatic Invariants (Q.E.D.)
          </span>
          <div className="flex flex-col gap-1.5">
            {simulationState.invariants.map((inv) => (
              <div
                key={inv.id}
                className="p-2 rounded border flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[11px] text-[var(--text-primary)]">
                      {inv.name}
                    </span>
                    <span className="text-[10px] text-[var(--syntax-logic)]">
                      {inv.formula}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-sans truncate">
                    {inv.description}
                  </span>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  {inv.satisfied ? (
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"
                      style={{
                        backgroundColor: 'rgba(72, 179, 133, 0.15)',
                        color: 'var(--status-qed)',
                        border: '1px solid rgba(72, 179, 133, 0.3)',
                      }}
                    >
                      <span>∎</span>
                      <span>Q.E.D.</span>
                    </span>
                  ) : (
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-1"
                      style={{
                        backgroundColor: 'rgba(224, 108, 117, 0.15)',
                        color: 'var(--status-error)',
                        border: '1px solid rgba(224, 108, 117, 0.3)',
                      }}
                    >
                      <AlertCircle size={10} />
                      <span>VIOLATED</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
