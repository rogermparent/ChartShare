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

  const dropdownContent = (
    <>
      <h3 className="mb-2 text-sm font-semibold">Bookmark Groups</h3>

      {groups.length === 0 ? (
        <p className="mb-2 text-sm text-gray-500">No groups yet</p>
      ) : (
        <ul className="mb-2 max-h-40 overflow-y-auto md:max-h-40">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex min-h-[44px] items-center gap-2 py-1 md:min-h-0"
            >
              <input
                type="checkbox"
                checked={isChartInGroup(group.id, chartId)}
                onChange={() => handleToggleChart(group.id)}
                className="h-5 w-5 md:h-4 md:w-4"
                aria-label={group.name}
              />
              <span className="flex-1 text-base md:text-sm">{group.name}</span>
              <button
                onClick={() => deleteGroup(group.id)}
                className="text-xs text-red-500 active:text-red-700 md:hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mb-2 flex gap-1">
        <label htmlFor="new-group-name" className="sr-only">New group name</label>
        <input
          id="new-group-name"
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="New group name"
          className="flex-1 rounded border border-gray-300 dark:border-slate-600 px-2 py-2 text-base md:py-1 md:text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
        />
        <button
          onClick={handleCreateGroup}
          className="rounded bg-blue-600 px-3 py-2 text-xs text-white active:bg-blue-700 md:px-2 md:py-1 md:hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="flex gap-1 border-t border-gray-200 dark:border-slate-700 pt-2">
        <button
          onClick={handleExport}
          className="rounded border border-gray-300 dark:border-slate-600 px-2 py-1 text-xs active:bg-sky-100 dark:active:bg-sky-900 md:hover:bg-sky-50 md:dark:hover:bg-sky-950"
        >
          Export
        </button>
        <button
          onClick={() => setShowImport(!showImport)}
          className="rounded border border-gray-300 dark:border-slate-600 px-2 py-1 text-xs active:bg-sky-100 dark:active:bg-sky-900 md:hover:bg-sky-50 md:dark:hover:bg-sky-950"
        >
          Import
        </button>
      </div>

      {showImport && (
        <div className="mt-2">
          <label htmlFor="import-data" className="sr-only">Import data</label>
          <textarea
            id="import-data"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste bookmark JSON here"
            className="w-full rounded border border-gray-300 dark:border-slate-600 px-2 py-2 font-mono text-sm md:py-1 md:text-xs"
            rows={4}
          />
          {importError && (
            <p className="text-xs text-red-600" role="alert">{importError}</p>
          )}
          <button
            onClick={handleImport}
            className="mt-1 rounded bg-green-600 px-2 py-1 text-xs text-white active:bg-green-700 md:hover:bg-green-700"
          >
            Apply Import
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded border border-gray-300 dark:border-slate-600 px-3 py-1.5 text-sm active:bg-sky-100 dark:active:bg-sky-900 md:hover:bg-sky-50 md:dark:hover:bg-sky-950"
      >
        Bookmark
      </button>

      {open && (
        <>
          {/* Mobile: bottom sheet with backdrop */}
          <div
            className="fixed inset-0 z-10 bg-black/40 md:hidden"
            style={{ animation: "backdrop-blur-enter 0.2s ease-out" }}
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-label="Bookmark Groups"
            className="fixed inset-x-0 bottom-0 z-20 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-stone-950 p-4 shadow-lg md:absolute md:inset-auto md:right-0 md:top-full md:z-10 md:mt-1 md:w-72 md:max-h-none md:overflow-visible md:rounded md:border md:border-gray-200 dark:md:border-gray-700 dark:border-slate-700 md:p-3"
            style={{ animation: "slide-up 0.25s ease-out" }}
          >
            {/* Drag indicator - mobile only */}
            <div className="mb-3 flex justify-center md:hidden">
              <div className="h-1 w-10 rounded-full bg-sky-300" />
            </div>
            {dropdownContent}
            <div className="pb-[env(safe-area-inset-bottom)] md:pb-0" />
          </div>
        </>
      )}
    </div>
  );
}
