import { AutocompleteSuggestion } from '../types/axiom';

export const AXIOM_KEYWORDS = new Set([
  'axiom',
  'world',
  'define',
  'rule',
  'when',
  'if',
  'else',
  'while',
  'simulate',
  'import',
  'use',
  'character',
  'environment',
  'visual',
  'theorem',
  'lemma',
  'invariant',
  'assume',
  'prove',
  'assert',
  'entity',
  'steps',
]);

export const AXIOM_LOGIC_OPERATORS = new Set([
  ':=',
  '+=',
  '-=',
  '*=',
  '/=',
  '->',
  '=>',
  '<=',
  '>=',
  '==',
  '!=',
  '∀',
  '∃',
  '⊢',
  '∷',
  '≔',
  '¬',
  '∧',
  '∨',
  '::',
]);

// Units regex that matches standard SI, physical, and simulation quantities
export const UNIT_REGEX = /^(\d+(\.\d+)?(e[+-]?\d+)?)(°C|K|m\/s²|m\/s|kg\/m³|W\/m²|J\/\(kg·K\)|J\/mol|mol\/\(m²·s\)|W\/\(m²·K⁴\)|m³|L\/s|mol|kPa|Pa|bar|m|km|cm|mm|kg|g|mg|s|ms|min|h|J|kJ|W|kW|steps)$/;

export interface TokenSpan {
  text: string;
  type:
    | 'keyword'
    | 'definition'
    | 'rule'
    | 'logic'
    | 'unit'
    | 'number'
    | 'string'
    | 'comment'
    | 'variable'
    | 'property'
    | 'bracket'
    | 'whitespace'
    | 'plain';
}

/**
 * Tokenizes a single line of AXIOM code into styled spans
 */
export function tokenizeAxiomLine(line: string): TokenSpan[] {
  const spans: TokenSpan[] = [];
  let i = 0;
  const n = line.length;

  while (i < n) {
    // 1. Check for single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      spans.push({ text: line.substring(i), type: 'comment' });
      break;
    }

    // 2. Whitespace
    if (/\s/.test(line[i])) {
      let ws = '';
      while (i < n && /\s/.test(line[i])) {
        ws += line[i];
        i++;
      }
      spans.push({ text: ws, type: 'whitespace' });
      continue;
    }

    // 3. String literal
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let str = quote;
      i++;
      while (i < n && line[i] !== quote) {
        str += line[i];
        i++;
      }
      if (i < n && line[i] === quote) {
        str += quote;
        i++;
      }
      spans.push({ text: str, type: 'string' });
      continue;
    }

    // 4. Quantities with units (e.g., 100°C, 9.81m/s², 10m, 5kg, 10steps, 0.50s)
    const quantityMatch = line.substring(i).match(/^([+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?)(°C|K|m\/s²|m\/s|kg\/m³|W\/m²|J\/\(kg·K\)|J\/mol|mol\/\(m²·s\)|W\/\(m²·K⁴\)|m³|L\/s|mol|kPa|Pa|bar|m|km|cm|mm|kg|g|mg|s|ms|min|h|J|kJ|W|kW|steps)/);
    if (quantityMatch) {
      const numPart = quantityMatch[1];
      const unitPart = quantityMatch[2];
      spans.push({ text: numPart, type: 'number' });
      spans.push({ text: unitPart, type: 'unit' });
      i += quantityMatch[0].length;
      continue;
    }

    // 5. Standalone numbers
    const numMatch = line.substring(i).match(/^([+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/);
    if (numMatch && !/[a-zA-Z_]/.test(line[i - 1] || '')) {
      spans.push({ text: numMatch[0], type: 'number' });
      i += numMatch[0].length;
      continue;
    }

    // 6. Two-char or multi-char logic operators (:=, +=, -=, *=, /=, ->, =>, <=, >=, ==, !=, ::)
    const op2 = line.substring(i, i + 2);
    if ([':=', '+=', '-=', '*=', '/=', '->', '=>', '<=', '>=', '==', '!=', '::'].includes(op2)) {
      spans.push({ text: op2, type: 'logic' });
      i += 2;
      continue;
    }

    // 7. Single char logic and math operators
    const char = line[i];
    if (['∀', '∃', '⊢', '∷', '≔', '¬', '∧', '∨', '+', '-', '*', '/', '=', '<', '>'].includes(char)) {
      spans.push({ text: char, type: 'logic' });
      i++;
      continue;
    }

    // 8. Brackets
    if (['{', '}', '(', ')', '[', ']', ';', ',', '.'].includes(char)) {
      spans.push({ text: char, type: 'bracket' });
      i++;
      continue;
    }

    // 9. Identifier or Keyword
    const idMatch = line.substring(i).match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (idMatch) {
      const word = idMatch[0];
      if (AXIOM_KEYWORDS.has(word)) {
        if (word === 'define' || word === 'entity' || word === 'character') {
          spans.push({ text: word, type: 'definition' });
        } else if (word === 'rule' || word === 'when' || word === 'simulate') {
          spans.push({ text: word, type: 'rule' });
        } else {
          spans.push({ text: word, type: 'keyword' });
        }
      } else if (word === 'true' || word === 'false' || word === 'liquid' || word === 'gas' || word === 'solid' || word === 'active') {
        spans.push({ text: word, type: 'definition' });
      } else {
        spans.push({ text: word, type: 'variable' });
      }
      i += word.length;
      continue;
    }

    // 10. Fallback character
    spans.push({ text: line[i], type: 'plain' });
    i++;
  }

  return spans;
}

/**
 * Autocomplete symbols database
 */
export const AUTOCOMPLETE_DATASET: AutocompleteSuggestion[] = [
  // Properties for water / thermodynamic entities
  {
    label: 'temperature',
    kind: 'property',
    detail: 'Temperature state',
    unitOrType: '°C',
    insertText: 'temperature',
    documentation: 'Thermodynamic scalar measuring average thermal kinetic energy.',
  },
  {
    label: 'pressure',
    kind: 'property',
    detail: 'Atmospheric / fluid pressure',
    unitOrType: 'Pa',
    insertText: 'pressure',
    documentation: 'Normal force exerted per unit area by molecular collisions.',
  },
  {
    label: 'density',
    kind: 'property',
    detail: 'Volumetric mass density',
    unitOrType: 'kg/m³',
    insertText: 'density',
    documentation: 'Volumetric mass density (ρ = m/V).',
  },
  {
    label: 'volume',
    kind: 'property',
    detail: 'Spatial boundary volume',
    unitOrType: 'm³',
    insertText: 'volume',
    documentation: 'Three-dimensional spatial envelope occupied by the substance.',
  },
  {
    label: 'state',
    kind: 'property',
    detail: 'Phase manifestation',
    unitOrType: 'liquid | gas | solid',
    insertText: 'state',
    documentation: 'Discrete thermodynamic phase of matter.',
  },
  {
    label: 'position',
    kind: 'property',
    detail: 'Spatial coordinate vector',
    unitOrType: 'm',
    insertText: 'position',
    documentation: 'Positional coordinates in world frame.',
  },
  {
    label: 'velocity',
    kind: 'property',
    detail: 'Instantaneous velocity vector',
    unitOrType: 'm/s',
    insertText: 'velocity',
    documentation: 'First derivative of position with respect to simulation time.',
  },
  {
    label: 'heat_flux',
    kind: 'property',
    detail: 'Thermal transfer rate per unit area',
    unitOrType: 'W/m²',
    insertText: 'heat_flux',
    documentation: 'Rate of thermal energy transfer through a given surface.',
  },
  {
    label: 'boiling_point',
    kind: 'constant',
    detail: 'Vaporization boundary threshold',
    unitOrType: '100°C',
    insertText: 'boiling_point',
    documentation: 'Equilibrium temperature at standard atmospheric pressure.',
  },
  {
    label: 'freezing_point',
    kind: 'constant',
    detail: 'Solidification boundary threshold',
    unitOrType: '0°C',
    insertText: 'freezing_point',
    documentation: 'Liquid-solid phase transition temperature at 1 atm.',
  },

  // Language keywords and syntax constructs
  {
    label: 'axiom',
    kind: 'keyword',
    detail: 'Root axiomatic system declaration',
    unitOrType: 'keyword',
    insertText: 'axiom ${1:WorldName} {\n    $0\n}',
    documentation: 'Declares an isolated formal logical and mathematical universe.',
  },
  {
    label: 'define',
    kind: 'keyword',
    detail: 'Formal invariant definition',
    unitOrType: 'keyword',
    insertText: 'define ${1:symbol} := ${2:value}',
    documentation: 'Assigns an immutable mathematical definition or constant.',
  },
  {
    label: 'rule',
    kind: 'keyword',
    detail: 'State transition law',
    unitOrType: 'keyword',
    insertText: 'rule ${1:name} {\n    ${2:expression}\n}',
    documentation: 'Defines an inductive dynamic transition rule executed per step.',
  },
  {
    label: 'when',
    kind: 'keyword',
    detail: 'Discrete event trigger',
    unitOrType: 'keyword',
    insertText: 'when ${1:condition} {\n    $0\n}',
    documentation: 'Executes discrete state updates when mathematical condition holds.',
  },
  {
    label: 'invariant',
    kind: 'keyword',
    detail: 'Universal conservation constraint',
    unitOrType: 'keyword',
    insertText: 'invariant ${1:Name} {\n    ${2:condition}\n}',
    documentation: 'Asserts a mathematical law that must hold true across all simulation steps.',
  },
  {
    label: 'simulate',
    kind: 'keyword',
    detail: 'Temporal integration directive',
    unitOrType: 'keyword',
    insertText: 'simulate ${1:10} steps',
    documentation: 'Specifies the number of discrete evaluation steps for this model.',
  },

  // Units
  {
    label: '°C',
    kind: 'unit',
    detail: 'Celsius temperature scale',
    unitOrType: 'Unit [Θ]',
    insertText: '°C',
    documentation: 'Empirical temperature scale based on 0°C freezing, 100°C boiling.',
  },
  {
    label: 'K',
    kind: 'unit',
    detail: 'Kelvin absolute temperature',
    unitOrType: 'Unit [Θ]',
    insertText: 'K',
    documentation: 'SI thermodynamic temperature base unit.',
  },
  {
    label: 'kg/m³',
    kind: 'unit',
    detail: 'Density unit',
    unitOrType: 'Unit [M·L⁻³]',
    insertText: 'kg/m³',
    documentation: 'SI derived volumetric mass density.',
  },
  {
    label: 'm/s²',
    kind: 'unit',
    detail: 'Acceleration unit',
    unitOrType: 'Unit [L·T⁻²]',
    insertText: 'm/s²',
    documentation: 'Standard gravitational acceleration dimension.',
  },
  {
    label: 'Pa',
    kind: 'unit',
    detail: 'Pascal pressure unit',
    unitOrType: 'Unit [M·L⁻¹·T⁻²]',
    insertText: 'Pa',
    documentation: 'SI derived pressure unit (1 N/m²).',
  },
];
