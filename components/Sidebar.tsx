"use client";

import { ChartRecord } from "@/lib/types";

interface SidebarProps {
  charts: ChartRecord[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (chart: ChartRecord) => void;
  onNew: () => void;
}

export default function Sidebar({ charts, loading, selectedId, onSelect, onNew }: SidebarProps) {
  return (
    <aside
      data-testid="sidebar"
      className="flex h-screen w-72 flex-col border-r border-gray-200 bg-gray-50"
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Charts</h2>
        <button
          data-testid="new-chart-btn"
          onClick={onNew}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="p-4 text-sm text-gray-500" data-testid="sidebar-loading">Loading...</p>
        ) : charts.length === 0 ? (
          <p className="p-4 text-sm text-gray-500" data-testid="sidebar-empty">No charts yet</p>
        ) : (
          <ul data-testid="chart-list">
            {charts.map((chart) => (
              <li
                key={chart.id}
                data-testid={`chart-item-${chart.id}`}
                onClick={() => onSelect(chart)}
                className={`cursor-pointer border-b border-gray-100 p-4 hover:bg-gray-100 ${
                  selectedId === chart.id ? "border-l-4 border-l-blue-600 bg-blue-50" : ""
                }`}
              >
                <p className="font-medium" data-testid={`chart-name-${chart.id}`}>{chart.name}</p>
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
