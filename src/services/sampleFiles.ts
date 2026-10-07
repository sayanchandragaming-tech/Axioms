import { AxiomFile, FileNode } from '../types/axiom';

export const INITIAL_FILES: Record<string, AxiomFile> = {
  'file-main': {
    id: 'file-main',
    name: 'main.axiom',
    path: 'AXIOM Project/main.axiom',
    content: `// =======================================================
// AXIOM Language Demonstration: Water Phase Transitions
// Build logic. Define worlds.
// =======================================================

import "water.axiom"
import "world.axiom"

axiom WaterWorld {
    // Fundamental thermodynamic boundary definitions
    define boiling_point := 100°C
    define freezing_point := 0°C
    define ambient_pressure := 101325Pa

    // World entity state definitions
    water {
        temperature := 20°C
        state := liquid
        volume := 1.0m³
        density := 1000kg/m³
        heat_flux := 1500W/m²
    }

    // Mathematical rule for continuous heat influx
    rule heating {
        water.temperature += 10°C
    }

    // Discrete state-transition predicate
    when water.temperature >= boiling_point {
        water.state := gas
        water.volume := 1600m³
        water.density := 0.59kg/m³
    }

    // World invariant: Temperature must satisfy the Third Law
    invariant NonNegativeAbsoluteTemp {
        water.temperature >= -273.15°C
    }

    // Discrete simulation trajectory
    simulate 10 steps
}
`,
  },

  'file-water': {
    id: 'file-water',
    name: 'water.axiom',
    path: 'AXIOM Project/water.axiom',
    content: `// =======================================================
// Thermodynamic properties & equations of state for H2O
// =======================================================

axiom WaterConstituents {
    define molar_mass := 0.018015kg/mol
    define specific_heat_liquid := 4184J/(kg·K)
    define specific_heat_vapor := 1996J/(kg·K)
    define latent_heat_vaporization := 2260000J/kg

    entity WaterSubstance {
        mass := 5.0kg
        internal_energy := 418400J
        entropy := 1307J/K
    }

    rule internal_energy_transfer {
        WaterSubstance.internal_energy += 5000J
    }

    invariant EnergyConservation {
        WaterSubstance.internal_energy > 0J
    }
}
`,
  },

  'file-fire': {
    id: 'file-fire',
    name: 'fire.axiom',
    path: 'AXIOM Project/fire.axiom',
    content: `// =======================================================
// Heat Source & Exothermic Radiation Models
// =======================================================

axiom HeatSource {
    define stefan_boltzmann := 5.67037e-8W/(m²·K⁴)
    define flame_temp := 1200°C

    burner {
        status := active
        output_power := 2500W
        efficiency := 0.88
    }

    rule combustion_cycle {
        burner.output_power := 2500W * burner.efficiency
    }
}
`,
  },

  'file-plant': {
    id: 'file-plant',
    name: 'plant.axiom',
    path: 'AXIOM Project/plant.axiom',
    content: `// =======================================================
// Biological Transpiration & Moisture Exchange
// =======================================================

axiom PlantBiosystem {
    define stomatal_conductance := 0.25mol/(m²·s)
    
    vegetation {
        leaf_area_index := 3.4
        moisture_uptake := 0.04L/s
        biomass := 12.5kg
    }

    rule photosynthesis_cycle {
        vegetation.biomass += 0.005kg
    }
}
`,
  },

  'file-world': {
    id: 'file-world',
    name: 'world.axiom',
    path: 'AXIOM Project/world.axiom',
    content: `// =======================================================
// Planetary & Atmospheric Enclosure Invariants
// =======================================================

axiom WorldBoundary {
    define gravity := 9.81m/s²
    define gas_constant := 8.314J/(mol·K)

    atmosphere {
        surface_temp := 288.15K
        scale_height := 8500m
        total_pressure := 101325Pa
    }

    invariant HydrostaticBalance {
        atmosphere.total_pressure > 0Pa
    }
}
`,
  },

  'file-mismatch-demo': {
    id: 'file-mismatch-demo',
    name: 'dimension_check.axiom',
    path: 'AXIOM Project/dimension_check.axiom',
    content: `// =======================================================
// Formal Unit & Dimension Verification Test
// Demonstrates AXIOM dimensional consistency diagnostics
// =======================================================

axiom DimensionalVerification {
    define distance := 10m
    define mass := 5kg

    rule invalid_addition {
        // ERROR: Cannot add quantities with incompatible dimensions [L] + [M]
        total := 10m + 5kg
    }
}
`,
  },
};

export const INITIAL_PROJECT_TREE: FileNode = {
  id: 'root-project',
  name: 'AXIOM Project',
  path: 'AXIOM Project',
  type: 'folder',
  isOpen: true,
  children: [
    {
      id: 'file-main',
      name: 'main.axiom',
      path: 'AXIOM Project/main.axiom',
      type: 'file',
    },
    {
      id: 'file-water',
      name: 'water.axiom',
      path: 'AXIOM Project/water.axiom',
      type: 'file',
    },
    {
      id: 'file-fire',
      name: 'fire.axiom',
      path: 'AXIOM Project/fire.axiom',
      type: 'file',
    },
    {
      id: 'file-plant',
      name: 'plant.axiom',
      path: 'AXIOM Project/plant.axiom',
      type: 'file',
    },
    {
      id: 'file-world',
      name: 'world.axiom',
      path: 'AXIOM Project/world.axiom',
      type: 'file',
    },
    {
      id: 'file-mismatch-demo',
      name: 'dimension_check.axiom',
      path: 'AXIOM Project/dimension_check.axiom',
      type: 'file',
    },
  ],
};
