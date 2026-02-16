"use client";

import { useState } from "react";

interface BookmarkManagerProps {
  chartId: number;
  groups: { id: string; name: string; chartIds: number[] }[];
  isChartInGroup: (groupId: string, chartId: number) => boolean;
  addChartToGroup: (groupId: string, chartId: number) => void;
  removeChartFromGroup: (groupId: string, chartId: number) => void;
  createGroup: (name: string, chartId?: number) => void;
  deleteGroup: (groupId: string) => void;
  exportGroups: () => string;
  importGroups: (json: string) => void;
}

export default function BookmarkManager({
  chartId,
  groups,
  isChartInGroup,
  addChartToGroup,
  removeChartFromGroup,
  createGroup,
  deleteGroup,
  exportGroups,
  importGroups,
}: BookmarkManagerProps) {
  const [open, setOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const handleToggleChart = (groupId: string) => {
    if (isChartInGroup(groupId, chartId)) {
      removeChartFromGroup(groupId, chartId);
    } else {
      addChartToGroup(groupId, chartId);
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      createGroup(newGroupName.trim(), chartId);
      setNewGroupName("");
    }
  };

  const handleExport = () => {
    navigator.clipboard.writeText(exportGroups());
  };

  const handleImport = () => {
    try {
      importGroups(importText);
      setImportText("");
      setShowImport(false);
      setImportError(null);
    } catch (e) {
      setImportError((e as Error).message);
    }
  };

  return (
    <div className="relative" data-testid="bookmark-manager">
      <button
        data-testid="bookmark-btn"
        onClick={() => setOpen(!open)}
        className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        Bookmark
      </button>

      {open && (
        <div
          data-testid="bookmark-dropdown"
          className="absolute right-0 top-full z-10 mt-1 w-72 rounded border border-gray-200 bg-white p-3 shadow-lg"
        >
          <h3 className="mb-2 text-sm font-semibold">Bookmark Groups</h3>

          {groups.length === 0 ? (
            <p className="mb-2 text-sm text-gray-500">No groups yet</p>
          ) : (
            <ul className="mb-2 max-h-40 overflow-y-auto">
              {groups.map((group) => (
                <li key={group.id} className="flex items-center gap-2 py-1" data-testid={`bookmark-group-${group.id}`}>
                  <input
                    type="checkbox"
                    checked={isChartInGroup(group.id, chartId)}
                    onChange={() => handleToggleChart(group.id)}
                    data-testid={`bookmark-checkbox-${group.id}`}
                  />
                  <span className="flex-1 text-sm">{group.name}</span>
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                    data-testid={`delete-group-${group.id}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mb-2 flex gap-1">
            <input
              data-testid="new-group-input"
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="New group name"
              className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
            />
            <button
              data-testid="add-group-btn"
              onClick={handleCreateGroup}
              className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <div className="flex gap-1 border-t border-gray-200 pt-2">
            <button
              data-testid="export-bookmarks-btn"
              onClick={handleExport}
              className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
            >
              Export
            </button>
            <button
              data-testid="import-bookmarks-btn"
              onClick={() => setShowImport(!showImport)}
              className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
            >
              Import
            </button>
          </div>

          {showImport && (
            <div className="mt-2">
              <textarea
                data-testid="import-textarea"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste bookmark JSON here"
                className="w-full rounded border border-gray-300 px-2 py-1 font-mono text-xs"
                rows={4}
              />
              {importError && (
                <p className="text-xs text-red-600" data-testid="import-error">{importError}</p>
              )}
              <button
                data-testid="confirm-import-btn"
                onClick={handleImport}
                className="mt-1 rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
              >
                Apply Import
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
