"use client";

import { ChartRecord, BookmarkGroup } from "../lib/types";

interface SidebarProps {
  charts: ChartRecord[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (chart: ChartRecord) => void;
  onNew?: () => void;
  bookmarkGroups: BookmarkGroup[];
  activeGroupId: string | null;
  onGroupChange: (groupId: string | null) => void;
}

export default function Sidebar({ charts, loading, selectedId, onSelect, onNew, bookmarkGroups, activeGroupId, onGroupChange }: SidebarProps) {
  const activeGroup = activeGroupId ? bookmarkGroups.find((g) => g.id === activeGroupId) : null;
  const filteredCharts = activeGroup
    ? charts.filter((c) => activeGroup.chartIds.includes(c.id))
    : charts;
  return (
    <aside
      aria-label="Charts"
      className="flex h-full w-full flex-col bg-gray-50 md:h-screen md:w-72 md:border-r md:border-gray-200"
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Charts</h2>
        {onNew && (
          <button
            onClick={onNew}
            className="rounded bg-blue-600 px-3 py-2.5 text-sm text-white active:bg-blue-700 md:py-1.5 md:hover:bg-blue-700"
          >
            New
          </button>
        )}
      </div>

      {bookmarkGroups.length > 0 && (
        <div className="border-b border-gray-200 px-4 py-2">
          <label>
            <span className="sr-only">Filter by group</span>
            <select
              aria-label="Filter by group"
              value={activeGroupId ?? ""}
              onChange={(e) => onGroupChange(e.target.value || null)}
              className="w-full rounded border border-gray-300 py-2.5 text-base md:py-1.5 md:text-sm"
            >
              <option value="">All Charts</option>
              {bookmarkGroups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-gray-500">Loading...</p>
        ) : filteredCharts.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">{activeGroupId ? "No charts in this group" : "No charts yet"}</p>
        ) : (
          <ul>
            {filteredCharts.map((chart) => (
              <li
                key={chart.id}
                onClick={() => onSelect(chart)}
                className={`cursor-pointer border-b border-gray-100 p-4 active:bg-gray-100 md:hover:bg-gray-100 ${
                  selectedId === chart.id ? "border-l-4 border-l-blue-600 bg-blue-50" : ""
                }`}
              >
                <p className="font-medium">{chart.name}</p>
                {chart.description && (
                  <p className="mt-1 text-sm text-gray-500 truncate">{chart.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
