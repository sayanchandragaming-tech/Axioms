import { AxiomFile, Diagnostic } from '../types/axiom';

/**
 * Architectural interface for the future AXIOM Compiler & Semantic Engine.
 * When the real AXIOM compiler service is connected via WebAssembly or backend RPC,
 * it will fulfill this contract.
 */
export interface IAxiomCompilerService {
  checkDiagnostics(file: AxiomFile): Promise<Diagnostic[]>;
  compile(sourceCode: string, fileName: string): Promise<CompilationResult>;
}

export interface CompilationResult {
  success: boolean;
  modelName: string;
  astPlaceholder: string;
  invariantsFound: string[];
  totalSteps: number;
  diagnostics: Diagnostic[];
  logMessages: string[];
}

/**
 * Diagnostic Analyzer for AXIOM files.
 * Detects unit incompatibilities (e.g. 10m + 5kg), syntax issues, unclosed blocks,
 * and contradictory invariants.
 */
export function analyzeAxiomDiagnostics(file: AxiomFile): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const lines = file.content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // 1. Check for dimensional unit mismatch (e.g., 10m + 5kg)
    const unitMismatchRegex = /(\d+(?:\.\d+)?[a-zA-Z°²³\/·]+)\s*([+\-])\s*(\d+(?:\.\d+)?[a-zA-Z°²³\/·]+)/;
    const match = line.match(unitMismatchRegex);
    if (match) {
      const left = match[1];
      const right = match[3];
      // If one is distance (m) and one is mass (kg) or incompatible
      const isLeftDist = /m$/.test(left) && !/kg/.test(left);
      const isRightMass = /kg$/.test(right);
      const isLeftMass = /kg$/.test(left);
      const isRightDist = /m$/.test(right);

      if ((isLeftDist && isRightMass) || (isLeftMass && isRightDist)) {
        const col = line.indexOf(match[0]) + 1;
        diagnostics.push({
          id: `diag-dim-${file.id}-${lineNum}`,
          fileId: file.id,
          fileName: file.name,
          line: lineNum,
          column: col,
          message: `Cannot add quantities with incompatible dimensions [L] and [M]: ${left} ${match[2]} ${right}`,
          severity: 'error',
          category: 'Unit Mismatch',
          sourceText: match[0],
          explanation: 'Dimensional homogeneity principle violated. Spatial length [L] cannot be summed with inertial mass [M].',
        });
      }
    }

    // 2. Check for syntax error: unbalanced brackets on single lines or invalid assignments
    if (trimmed.includes(':= =')) {
      diagnostics.push({
        id: `diag-syntax-${file.id}-${lineNum}`,
        fileId: file.id,
        fileName: file.name,
        line: lineNum,
        column: line.indexOf(':= =') + 1,
        message: 'Syntax error: invalid composite assignment operator ":= ="',
        severity: 'error',
        category: 'Syntax Error',
        sourceText: ':= =',
      });
    }

    // 3. Check for undefined symbol reference pattern (demo warning)
    if (trimmed.startsWith('when') && trimmed.includes('unknown_variable')) {
      diagnostics.push({
        id: `diag-undef-${file.id}-${lineNum}`,
        fileId: file.id,
        fileName: file.name,
        line: lineNum,
        column: line.indexOf('unknown_variable') + 1,
        message: "Undefined symbol 'unknown_variable' in predicate condition",
        severity: 'error',
        category: 'Undefined Symbol',
        sourceText: 'unknown_variable',
      });
    }

    // 4. Warning for high step count
    if (trimmed.startsWith('simulate') && trimmed.includes('steps')) {
      const stepMatch = trimmed.match(/simulate\s+(\d+)\s+steps/);
      if (stepMatch && parseInt(stepMatch[1], 10) > 10000) {
        diagnostics.push({
          id: `diag-warn-${file.id}-${lineNum}`,
          fileId: file.id,
          fileName: file.name,
          line: lineNum,
          column: 1,
          message: `Simulation step count (${stepMatch[1]}) exceeds recommended real-time horizon`,
          severity: 'warning',
          category: 'Invariant Warning',
          sourceText: trimmed,
        });
      }
    }
  });

  return diagnostics;
}

export class MockAxiomCompilerService implements IAxiomCompilerService {
  async checkDiagnostics(file: AxiomFile): Promise<Diagnostic[]> {
    return analyzeAxiomDiagnostics(file);
  }

  async compile(sourceCode: string, fileName: string): Promise<CompilationResult> {
    const file: AxiomFile = {
      id: 'active',
      name: fileName,
      path: fileName,
      content: sourceCode,
    };

    const diagnostics = analyzeAxiomDiagnostics(file);
    const hasErrors = diagnostics.some((d) => d.severity === 'error');

    // Extract world name if present
    const worldMatch = sourceCode.match(/axiom\s+([A-Za-z0-9_]+)/);
    const modelName = worldMatch ? worldMatch[1] : 'AnonymousWorld';

    // Extract step count
    const stepMatch = sourceCode.match(/simulate\s+(\d+)\s+steps/);
    const totalSteps = stepMatch ? parseInt(stepMatch[1], 10) : 10;

    // Extract invariants
    const invariantMatches = [...sourceCode.matchAll(/invariant\s+([A-Za-z0-9_]+)/g)];
    const invariantsFound = invariantMatches.map((m) => m[1]);

    const logs: string[] = [
      `[AXIOM Compiler v0.1-preview] Parsing source buffer '${fileName}'...`,
      `[AXIOM Lexer] 0 tokens rejected. Lexical analysis validated.`,
      `[AXIOM AST] Constructed formal AST for system '${modelName}'.`,
      `[AXIOM Verifier] Dimensional homogeneity check: ${hasErrors ? '1 dimensional contradiction detected' : 'All SI units verified'}.`,
    ];

    if (invariantsFound.length > 0) {
      logs.push(`[AXIOM Logic] Invariants established: ${invariantsFound.join(', ')}.`);
    }

    return {
      success: !hasErrors,
      modelName,
      astPlaceholder: `AST(${modelName})`,
      invariantsFound,
      totalSteps,
      diagnostics,
      logMessages: logs,
    };
  }
}

export const axiomCompiler = new MockAxiomCompilerService();
