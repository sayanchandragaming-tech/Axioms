import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { FileNode } from '../types/axiom';
import {
  ChevronRight,
  ChevronDown,
  FilePlus,
  FolderPlus,
  Trash2,
  Edit2,
  Folder,
  FolderOpen,
  RotateCcw,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const Explorer: React.FC = () => {
  const {
    projectTree,
    openFile,
    activeFile,
    createNewFile,
    createNewFolder,
    renameNode,
    deleteNode,
    diagnostics,
    resetProjectToDefault,
  } = useWorkspace();

  const [creatingType, setCreatingType] = useState<'file' | 'folder' | null>(null);
  const [createName, setCreateName] = useState('');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: FileNode | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  const createInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creatingType && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [creatingType]);

  useEffect(() => {
    if (editingNodeId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingNodeId]);

  // Close context menu on external click
  useEffect(() => {
    const handleOutsideClick = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleStartCreateFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreatingType('file');
    setCreateName('model.axiom');
  };

  const handleStartCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreatingType('folder');
    setCreateName('subsystem');
  };

  const handleCommitCreate = () => {
    if (!createName.trim()) {
      setCreatingType(null);
      return;
    }
    if (creatingType === 'file') {
      createNewFile(createName.trim());
    } else if (creatingType === 'folder') {
      createNewFolder(createName.trim());
    }
    setCreatingType(null);
    setCreateName('');
  };

  const handleCommitRename = () => {
    if (editingNodeId && editingName.trim()) {
      renameNode(editingNodeId, editingName.trim());
    }
    setEditingNodeId(null);
    setEditingName('');
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      node,
    });
  };

  const fileHasError = (nodeId: string) => {
    return diagnostics.some((d) => d.fileId === nodeId && d.severity === 'error');
  };

  return (
    <div
      className="w-64 border-r flex flex-col h-full select-none text-xs shrink-0 overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Explorer Header */}
      <div
        className="h-8 px-3 flex items-center justify-between border-b text-[11px] font-semibold tracking-wider uppercase"
        style={{
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <span>Explorer</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleStartCreateFile}
            className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="New AXIOM File (.axiom)"
          >
            <FilePlus size={13} />
          </button>
          <button
            onClick={handleStartCreateFolder}
            className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="New Folder"
          >
            <FolderPlus size={13} />
          </button>
          <button
            onClick={resetProjectToDefault}
            className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Reset Project Files"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Project Section Title */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 font-medium text-[11px] text-[var(--text-secondary)] border-b"
        style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-canvas)' }}>
        <FolderOpen size={12} className="text-[var(--border-focus)]" />
        <span className="font-semibold text-[var(--text-primary)]">AXIOM Project</span>
      </div>

      {/* File Tree List */}
      <div className="flex-1 overflow-y-auto py-1">
        {projectTree.children?.map((node) => {
          const isActive = activeFile?.id === node.id;
          const isEditing = editingNodeId === node.id;
          const hasError = fileHasError(node.id);

          return (
            <div
              key={node.id}
              onClick={() => {
                if (node.type === 'file') openFile(node.id);
              }}
              onContextMenu={(e) => handleContextMenu(e, node)}
              className={`group flex items-center justify-between px-3 py-1 cursor-pointer transition-colors relative ${
                isActive
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/60'
              }`}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  style={{ backgroundColor: 'var(--border-focus)' }}
                />
              )}

              <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                {node.type === 'folder' ? (
                  <Folder size={13} className="text-amber-500 shrink-0" />
                ) : (
                  <span
                    className="w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-mono shrink-0 font-bold"
                    style={{
                      color: hasError ? 'var(--status-error)' : 'var(--border-focus)',
                      backgroundColor: hasError ? 'rgba(224, 108, 117, 0.15)' : 'rgba(62, 130, 247, 0.12)',
                    }}
                  >
                    ∀
                  </span>
                )}

                {isEditing ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleCommitRename}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommitRename();
                      if (e.key === 'Escape') setEditingNodeId(null);
                    }}
                    className="bg-[var(--bg-canvas)] border border-[var(--border-focus)] px-1 rounded text-xs w-full text-[var(--text-primary)] outline-none"
                  />
                ) : (
                  <span className="truncate text-xs tracking-tight">{node.name}</span>
                )}
              </div>

              {/* Status and Action Icons */}
              <div className="flex items-center gap-1">
                {hasError && (
                  <span title="1 or more formal diagnostics in this file" className="flex items-center">
                    <AlertCircle
                      size={11}
                      className="shrink-0"
                      style={{ color: 'var(--status-error)' }}
                    />
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNodeId(node.id);
                    setEditingName(node.name);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-opacity"
                  title="Rename"
                >
                  <Edit2 size={10} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--status-error)] transition-opacity"
                  title="Delete"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Inline Create Input */}
        {creatingType && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-elevated)]">
            {creatingType === 'folder' ? (
              <Folder size={13} className="text-amber-500 shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-mono shrink-0 text-[var(--border-focus)]">
                ∀
              </span>
            )}
            <input
              ref={createInputRef}
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onBlur={handleCommitCreate}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCommitCreate();
                if (e.key === 'Escape') setCreatingType(null);
              }}
              className="bg-[var(--bg-canvas)] border border-[var(--border-focus)] px-1 rounded text-xs w-full text-[var(--text-primary)] outline-none"
            />
          </div>
        )}
      </div>

      {/* Explorer Bottom Invariant Health Preview */}
      <div
        className="p-2 border-t text-[10px] font-mono flex items-center justify-between"
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--bg-canvas)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>SI Units: OK</span>
        </span>
        <span>.axiom only</span>
      </div>

      {/* Right-click Context Menu */}
      {contextMenu.visible && contextMenu.node && (
        <div
          className="fixed rounded shadow-xl border py-1 z-50 text-xs w-36 select-none"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.node.type === 'file' && (
            <button
              onClick={() => {
                openFile(contextMenu.node!.id);
                setContextMenu((prev) => ({ ...prev, visible: false }));
              }}
              className="w-full text-left px-3 py-1 hover:bg-[var(--border-focus)]/20 flex items-center gap-2"
            >
              <FileText size={12} /> Open
            </button>
          )}
          <button
            onClick={() => {
              setEditingNodeId(contextMenu.node!.id);
              setEditingName(contextMenu.node!.name);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full text-left px-3 py-1 hover:bg-[var(--border-focus)]/20 flex items-center gap-2"
          >
            <Edit2 size={12} /> Rename
          </button>
          <button
            onClick={() => {
              deleteNode(contextMenu.node!.id);
              setContextMenu((prev) => ({ ...prev, visible: false }));
            }}
            className="w-full text-left px-3 py-1 hover:bg-rose-500/20 text-[var(--status-error)] flex items-center gap-2"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};
