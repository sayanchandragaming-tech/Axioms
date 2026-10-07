import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { tokenizeAxiomLine, AUTOCOMPLETE_DATASET } from '../services/axiomSyntax';
import { AutocompleteSuggestion, Diagnostic } from '../types/axiom';
import { AutocompletePopover } from './AutocompletePopover';
import { AlertCircle, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AxiomEditor: React.FC = () => {
  const {
    activeFile,
    updateFileContent,
    settings,
    diagnostics,
    setCursorPosition,
    cursorPosition,
    runCode,
    saveActiveFile,
  } = useWorkspace();

  const [code, setCode] = useState(activeFile?.content || '');
  const [activeLine, setActiveLine] = useState(1);
  const [activeCol, setActiveCol] = useState(1);

  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePos, setAutocompletePos] = useState({ top: 0, left: 0 });
  const [autocompleteFilter, setAutocompleteFilter] = useState('');
  const [selectedSuggestIndex, setSelectedSuggestIndex] = useState(0);

  // Diagnostic hover tooltip state
  const [hoveredDiagnostic, setHoveredDiagnostic] = useState<{
    diag: Diagnostic;
    x: number;
    y: number;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize code when activeFile changes
  useEffect(() => {
    if (activeFile) {
      setCode(activeFile.content);
    }
  }, [activeFile?.id, activeFile?.content]);

  // File specific diagnostics
  const fileDiagnostics = useMemo(() => {
    if (!activeFile) return [];
    return diagnostics.filter((d) => d.fileId === activeFile.id);
  }, [diagnostics, activeFile]);

  const lineDiagnosticMap = useMemo(() => {
    const map = new Map<number, Diagnostic>();
    fileDiagnostics.forEach((d) => {
      map.set(d.line, d);
    });
    return map;
  }, [fileDiagnostics]);

  const lines = useMemo(() => {
    return code.split('\n');
  }, [code]);

  // Filter autocomplete suggestions
  const filteredSuggestions = useMemo(() => {
    if (!autocompleteFilter) return AUTOCOMPLETE_DATASET.slice(0, 10);
    const filterLower = autocompleteFilter.toLowerCase();
    return AUTOCOMPLETE_DATASET.filter(
      (s) =>
        s.label.toLowerCase().includes(filterLower) ||
        (s.detail && s.detail.toLowerCase().includes(filterLower))
    ).slice(0, 10);
  }, [autocompleteFilter]);

  // Handle cursor and text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCode(newContent);
    if (activeFile) {
      updateFileContent(activeFile.id, newContent);
    }
    updateCursorInfo(e.target);
  };

  const updateCursorInfo = (target: HTMLTextAreaElement) => {
    const selStart = target.selectionStart;
    const textBefore = target.value.substring(0, selStart);
    const linesBefore = textBefore.split('\n');
    const lineNum = linesBefore.length;
    const colNum = linesBefore[linesBefore.length - 1].length + 1;

    setActiveLine(lineNum);
    setActiveCol(colNum);
    setCursorPosition({ line: lineNum, col: colNum });

    // Check if we should trigger autocomplete
    const currentLineText = linesBefore[linesBefore.length - 1];
    const dotMatch = currentLineText.match(/([a-zA-Z_0-9]+)\.([a-zA-Z_0-9]*)$/);
    const wordMatch = currentLineText.match(/([a-zA-Z_0-9]{2,})$/);

    if (dotMatch) {
      setAutocompleteFilter(dotMatch[2]);
      triggerAutocompletePopover(lineNum, colNum);
    } else if (wordMatch && !currentLineText.trim().startsWith('//')) {
      setAutocompleteFilter(wordMatch[1]);
      triggerAutocompletePopover(lineNum, colNum);
    } else {
      setShowAutocomplete(false);
    }
  };

  const triggerAutocompletePopover = (line: number, col: number) => {
    const lineHeightPx = settings.lineHeight || 20;
    const charWidthPx = 7.8;
    const gutterWidth = 56;

    const top = Math.min((line - 1) * lineHeightPx + 32, 400);
    const left = Math.min(gutterWidth + col * charWidthPx, 500);

    setAutocompletePos({ top, left });
    setSelectedSuggestIndex(0);
    setShowAutocomplete(true);
  };

  const handleInsertSuggestion = (suggestion: AutocompleteSuggestion) => {
    if (!textareaRef.current) return;
    const target = textareaRef.current;
    const selStart = target.selectionStart;
    const textBefore = target.value.substring(0, selStart);
    const textAfter = target.value.substring(selStart);

    // Replace the trailing filter word
    const regex = new RegExp(`${autocompleteFilter}$`);
    const newBefore = textBefore.replace(regex, '') + suggestion.insertText;
    const newCode = newBefore + textAfter;

    setCode(newCode);
    if (activeFile) {
      updateFileContent(activeFile.id, newCode);
    }
    setShowAutocomplete(false);

    // Reposition cursor
    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = newBefore.length;
        textareaRef.current.selectionStart = nextPos;
        textareaRef.current.selectionEnd = nextPos;
        textareaRef.current.focus();
        updateCursorInfo(textareaRef.current);
      }
    }, 0);
  };

  // Keyboard navigation within autocomplete and shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showAutocomplete && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestIndex((prev) => (prev + 1) % filteredSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestIndex(
          (prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length
        );
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleInsertSuggestion(filteredSuggestions[selectedSuggestIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAutocomplete(false);
        return;
      }
    }

    // Ctrl+Space manual trigger for autocomplete
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      triggerAutocompletePopover(activeLine, activeCol);
      return;
    }

    // Tab key indent
    if (e.key === 'Tab' && !showAutocomplete) {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const spaces = ' '.repeat(settings.tabSize || 4);
      const newText = target.value.substring(0, start) + spaces + target.value.substring(end);
      setCode(newText);
      if (activeFile) {
        updateFileContent(activeFile.id, newText);
      }
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm">
        No active AXIOM file selected.
      </div>
    );
  }

  // Detect axiom world block name for breadcrumb
  const axiomWorldName = code.match(/axiom\s+([A-Za-z0-9_]+)/)?.[1] || 'AnonymousWorld';

  return (
    <div
      ref={editorContainerRef}
      className="flex-1 flex flex-col h-full relative overflow-hidden select-text"
      style={{
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* Top Breadcrumb Navigation */}
      <div
        className="h-7 px-3 border-b flex items-center justify-between text-[11px] font-mono shrink-0 select-none"
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
        }}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span>AXIOM Project</span>
          <ChevronRight size={11} className="text-[var(--text-muted)]" />
          <span className="text-[var(--text-primary)] font-medium">{activeFile.name}</span>
          <ChevronRight size={11} className="text-[var(--text-muted)]" />
          <span className="text-[var(--border-focus)]">axiom {axiomWorldName}</span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          {fileDiagnostics.length > 0 ? (
            <span
              className="flex items-center gap-1 font-medium cursor-pointer"
              style={{ color: 'var(--status-error)' }}
              title="Click to view formal diagnostics in Problems panel"
            >
              <AlertCircle size={11} />
              <span>{fileDiagnostics.length} Diagnostic Warning(s)</span>
            </span>
          ) : (
            <span
              className="flex items-center gap-1 text-[var(--status-qed)] font-medium"
              title="All axioms and dimensional units verified"
            >
              <ShieldCheck size={11} />
              <span>Invariants Satisfied</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Editor Body: Gutter + Code Surface + Minimap */}
      <div className="flex-1 flex relative overflow-auto">
        {/* Line Numbers Gutter */}
        {settings.lineNumbers && (
          <div
            className="w-12 py-2 flex flex-col items-end pr-2 select-none border-r shrink-0 font-mono text-xs z-10"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              lineHeight: `${settings.lineHeight}px`,
              fontSize: `${settings.fontSize}px`,
            }}
          >
            {lines.map((_, idx) => {
              const lineNum = idx + 1;
              const isCurrent = lineNum === activeLine;
              const lineDiag = lineDiagnosticMap.get(lineNum);

              return (
                <div
                  key={`line-num-${lineNum}`}
                  className="w-full flex items-center justify-end gap-1.5 cursor-pointer relative"
                  style={{
                    color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                  onClick={() => {
                    setActiveLine(lineNum);
                    if (textareaRef.current) {
                      const pos = lines.slice(0, idx).join('\n').length + 1;
                      textareaRef.current.selectionStart = pos;
                      textareaRef.current.selectionEnd = pos;
                      textareaRef.current.focus();
                    }
                  }}
                >
                  {/* Diagnostic Marker in Gutter */}
                  {lineDiag && (
                    <span
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredDiagnostic({ diag: lineDiag, x: rect.right + 8, y: rect.top });
                      }}
                      onMouseLeave={() => setHoveredDiagnostic(null)}
                      className="w-2 h-2 rounded-full cursor-help animate-pulse"
                      style={{
                        backgroundColor:
                          lineDiag.severity === 'error'
                            ? 'var(--status-error)'
                            : 'var(--status-warning)',
                      }}
                      title={lineDiag.message}
                    />
                  )}
                  <span>{lineNum}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Code Container with Styled Overlay and Native Textarea */}
        <div className="flex-1 relative font-mono text-xs overflow-hidden">
          {/* Active Line Highlight Background */}
          <div
            className="absolute left-0 right-0 pointer-events-none transition-all"
            style={{
              top: `${(activeLine - 1) * settings.lineHeight + 8}px`,
              height: `${settings.lineHeight}px`,
              backgroundColor: 'var(--bg-elevated)',
              opacity: 0.7,
              borderLeft: '2px solid var(--border-focus)',
            }}
          />

          {/* Syntax Highlighted Rendered Surface */}
          <div
            className="absolute inset-0 py-2 pl-3 pr-8 pointer-events-none select-none font-mono whitespace-pre leading-relaxed overflow-hidden"
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: `${settings.lineHeight}px`,
            }}
          >
            {lines.map((lineText, lineIdx) => {
              const lineNum = lineIdx + 1;
              const lineDiag = lineDiagnosticMap.get(lineNum);
              const tokens = tokenizeAxiomLine(lineText);

              return (
                <div
                  key={`token-line-${lineNum}`}
                  className="relative whitespace-pre"
                  style={{ height: `${settings.lineHeight}px` }}
                >
                  {tokens.map((token, tokIdx) => {
                    let colorVar = 'var(--text-primary)';
                    let fontStyle = 'normal';
                    let fontWeight = '400';

                    switch (token.type) {
                      case 'keyword':
                        colorVar = 'var(--syntax-keyword)';
                        fontWeight = '600';
                        break;
                      case 'definition':
                        colorVar = 'var(--syntax-definition)';
                        fontWeight = '500';
                        break;
                      case 'rule':
                        colorVar = 'var(--syntax-rule)';
                        fontWeight = '600';
                        break;
                      case 'logic':
                        colorVar = 'var(--syntax-logic)';
                        fontWeight = '600';
                        break;
                      case 'unit':
                        colorVar = 'var(--syntax-unit)';
                        fontWeight = '600';
                        break;
                      case 'number':
                        colorVar = 'var(--syntax-number)';
                        break;
                      case 'string':
                        colorVar = 'var(--syntax-string)';
                        break;
                      case 'comment':
                        colorVar = 'var(--syntax-comment)';
                        fontStyle = 'italic';
                        break;
                      case 'variable':
                        colorVar = 'var(--text-primary)';
                        break;
                    }

                    const isDimCheckError =
                      lineDiag &&
                      lineDiag.sourceText &&
                      token.text.includes('10m') ||
                      (lineDiag && lineDiag.sourceText && token.text.includes('+') && lineDiag.category === 'Unit Mismatch');

                    return (
                      <span
                        key={`tok-${lineNum}-${tokIdx}`}
                        className={isDimCheckError ? 'squiggle-error' : ''}
                        style={{
                          color: colorVar,
                          fontStyle,
                          fontWeight,
                        }}
                      >
                        {token.text}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Transparent Input Textarea for editing */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onClick={(e) => updateCursorInfo(e.currentTarget)}
            onKeyUp={(e) => updateCursorInfo(e.currentTarget)}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            wrap={settings.wordWrap ? 'on' : 'off'}
            className="absolute inset-0 w-full h-full py-2 pl-3 pr-8 font-mono resize-none bg-transparent outline-none border-none caret-[var(--border-focus)] whitespace-pre z-20 text-transparent"
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: `${settings.lineHeight}px`,
              caretColor: 'var(--border-focus)',
            }}
          />
        </div>

        {/* Minimap representation */}
        {settings.minimap && (
          <div
            className="w-16 border-l py-2 px-1 select-none hidden lg:block shrink-0 overflow-hidden opacity-50 hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="w-full flex flex-col gap-[2px]">
              {lines.slice(0, 45).map((line, idx) => {
                const len = Math.min(line.trim().length, 30);
                const isDiag = lineDiagnosticMap.has(idx + 1);

                return (
                  <div
                    key={`mini-${idx}`}
                    className="h-[2px] rounded-xs"
                    style={{
                      width: `${Math.max(10, len * 3)}%`,
                      backgroundColor: isDiag
                        ? 'var(--status-error)'
                        : idx + 1 === activeLine
                        ? 'var(--border-focus)'
                        : 'var(--text-muted)',
                      opacity: idx + 1 === activeLine ? 1 : 0.4,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Autocomplete Popover */}
      {showAutocomplete && (
        <AutocompletePopover
          suggestions={filteredSuggestions}
          selectedIndex={selectedSuggestIndex}
          position={autocompletePos}
          onSelect={handleInsertSuggestion}
          onClose={() => setShowAutocomplete(false)}
        />
      )}

      {/* Diagnostic Hover Tooltip */}
      {hoveredDiagnostic && (
        <div
          className="fixed z-50 p-2.5 rounded shadow-xl border text-xs max-w-sm pointer-events-none backdrop-blur-md"
          style={{
            top: hoveredDiagnostic.y,
            left: hoveredDiagnostic.x,
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--status-error)',
          }}
        >
          <div className="flex items-center gap-1.5 font-semibold text-[var(--status-error)] text-[11px] uppercase tracking-wider mb-1">
            <AlertCircle size={13} />
            <span>{hoveredDiagnostic.diag.category}</span>
          </div>
          <div className="text-[var(--text-primary)] font-mono text-[11px] mb-1">
            {hoveredDiagnostic.diag.message}
          </div>
          {hoveredDiagnostic.diag.explanation && (
            <div className="text-[10px] text-[var(--text-secondary)] border-t pt-1 border-[var(--border-subtle)]">
              {hoveredDiagnostic.diag.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
