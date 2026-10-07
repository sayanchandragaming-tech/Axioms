import { SimulationState, InvariantStatus } from '../types/axiom';

/**
 * Architectural interface for the future AXIOM Simulation & Runtime Engine.
 */
export interface ISimulationEngine {
  init(worldName: string, maxSteps: number): SimulationState;
  step(state: SimulationState): SimulationState;
  reset(worldName?: string): SimulationState;
}

export function createDefaultSimulationState(worldName = 'WaterWorld'): SimulationState {
  const defaultInvariants: InvariantStatus[] = [
    {
      id: 'inv-1',
      name: 'NonNegativeAbsoluteTemp',
      formula: 'T >= -273.15°C',
      satisfied: true,
      description: 'Preserves the Third Law of Thermodynamics',
    },
    {
      id: 'inv-2',
      name: 'HydrostaticContinuity',
      formula: '∇P = -ρ·g',
      satisfied: true,
      description: 'Fluid equilibrium in gravitational gradient',
    },
    {
      id: 'inv-3',
      name: 'EnergyConservation',
      formula: 'ΔE - (Q - W) = 0J',
      satisfied: true,
      description: 'First Law of Thermodynamics closed-system invariant',
    },
  ];

  return {
    status: 'ready',
    worldName,
    currentStep: 0,
    maxSteps: 10,
    timeSeconds: 0,
    speed: 1,
    variables: {
      temperature: {
        name: 'water.temperature',
        value: 20,
        unit: '°C',
        type: 'scalar<temperature>',
        history: [20],
      },
      state: {
        name: 'water.state',
        value: 'liquid',
        type: 'phase_state',
      },
      volume: {
        name: 'water.volume',
        value: 1.0,
        unit: 'm³',
        type: 'scalar<volume>',
        history: [1.0],
      },
      density: {
        name: 'water.density',
        value: 1000,
        unit: 'kg/m³',
        type: 'scalar<density>',
        history: [1000],
      },
      heat_flux: {
        name: 'water.heat_flux',
        value: 1500,
        unit: 'W/m²',
        type: 'scalar<power_density>',
        history: [1500],
      },
      ambient_pressure: {
        name: 'ambient_pressure',
        value: 101325,
        unit: 'Pa',
        type: 'scalar<pressure>',
      },
      boiling_point: {
        name: 'boiling_point',
        value: 100,
        unit: '°C',
        type: 'scalar<temperature>',
      },
    },
    invariants: defaultInvariants,
  };
}

/**
 * Steps the simulation forward by 1 discrete tick according to AXIOM rules:
 * Rule heating: water.temperature += 10°C
 * When water.temperature >= boiling_point: water.state := gas
 */
export function stepSimulationState(state: SimulationState): SimulationState {
  if (state.currentStep >= state.maxSteps) {
    return { ...state, status: 'completed' };
  }

  const nextStep = state.currentStep + 1;
  const nextTime = parseFloat((nextStep * 0.05).toFixed(2));

  const currentTemp = (state.variables.temperature?.value as number) || 20;
  const newTemp = currentTemp + 10;
  const isVapor = newTemp >= 100;
  const newState = isVapor ? 'gas' : 'liquid';
  const newVol = isVapor ? 1600 : 1.0;
  const newDensity = isVapor ? 0.59 : 1000;

  const tempHistory = [...(state.variables.temperature?.history || []), newTemp];
  const volHistory = [...(state.variables.volume?.history || []), newVol];
  const densityHistory = [...(state.variables.density?.history || []), newDensity];

  // Invariant verification check
  const updatedInvariants = state.invariants.map((inv) => {
    if (inv.id === 'inv-1') {
      return { ...inv, satisfied: newTemp >= -273.15 };
    }
    return inv;
  });

  const isCompleted = nextStep >= state.maxSteps;

  return {
    ...state,
    currentStep: nextStep,
    timeSeconds: nextTime,
    status: isCompleted ? 'completed' : 'running',
    variables: {
      ...state.variables,
      temperature: {
        ...state.variables.temperature,
        value: newTemp,
        history: tempHistory,
      },
      state: {
        ...state.variables.state,
        value: newState,
      },
      volume: {
        ...state.variables.volume,
        value: newVol,
        history: volHistory,
      },
      density: {
        ...state.variables.density,
        value: newDensity,
        history: densityHistory,
      },
    },
    invariants: updatedInvariants,
  };
}
