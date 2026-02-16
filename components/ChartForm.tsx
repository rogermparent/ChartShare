"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { ChartRecord } from "@/lib/types";

const ChartRenderer = dynamic(() => import("./ChartRenderer"), { ssr: false });

interface ChartFormProps {
  chart?: ChartRecord;
  onSave: (name: string, description: string, chartData: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function ChartForm({ chart, onSave, onCancel, onDelete }: ChartFormProps) {
  const [name, setName] = useState(chart?.name ?? "");
  const [description, setDescription] = useState(chart?.description ?? "");
  const [chartData, setChartData] = useState(chart?.chartData ?? "");
  const [previewData, setPreviewData] = useState(chart?.chartData ?? "");
  const chartIdRef = useRef(chart?.id);

  // Sync from chart prop only when switching to a different chart
  useEffect(() => {
    if (chart && chart.id !== chartIdRef.current) {
      chartIdRef.current = chart.id;
      setName(chart.name);
      setDescription(chart.description);
      setChartData(chart.chartData);
      setPreviewData(chart.chartData);
    }
  }, [chart]);

  // Derive JSON error without state to avoid update loops
  const jsonError = useMemo(() => {
    if (!chartData.trim()) return null;
    try {
      JSON.parse(chartData);
      return null;
    } catch (e) {
      return (e as Error).message;
    }
  }, [chartData]);

  // Debounce preview rendering to avoid rapid AmCharts root creation/disposal
  useEffect(() => {
    if (jsonError) return;
    const timer = setTimeout(() => {
      setPreviewData(chartData);
    }, 500);
    return () => clearTimeout(timer);
  }, [chartData, jsonError]);

  const isValid = name.trim() !== "" && chartData.trim() !== "" && jsonError === null;

  return (
    <div className="flex h-full flex-col" data-testid="chart-form">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold">{chart ? "Edit Chart" : "New Chart"}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            data-testid="chart-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Chart name"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Description</label>
          <input
            data-testid="chart-description-input"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Chart description (optional)"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Chart Data (JSON)</label>
          <textarea
            data-testid="chart-data-input"
            value={chartData}
            onChange={(e) => setChartData(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            rows={12}
            placeholder='{"type": "XYChart", ...}'
          />
          {jsonError && (
            <p className="mt-1 text-sm text-red-600" data-testid="json-error">
              Invalid JSON: {jsonError}
            </p>
          )}
        </div>

        {previewData.trim() && !jsonError && (
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Preview</label>
            <div className="h-64 rounded border border-gray-200" data-testid="chart-preview">
              <ChartRenderer chartData={previewData} id="chart-preview" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-gray-200 p-4">
        <button
          data-testid="save-chart-btn"
          onClick={() => onSave(name, description, chartData)}
          disabled={!isValid}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          data-testid="cancel-btn"
          onClick={onCancel}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
        {chart && onDelete && (
          <button
            data-testid="delete-chart-btn"
            onClick={onDelete}
            className="ml-auto rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
