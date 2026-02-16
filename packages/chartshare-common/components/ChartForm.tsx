"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { ChartRecord } from "../lib/types";

const ChartRenderer = dynamic(() => import("./ChartRenderer"), { ssr: false });

interface ChartFormProps {
  chart?: ChartRecord;
  onSave: (name: string, description: string, chartData: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

export default function ChartForm({ chart, onSave, onCancel, onDelete, onBack }: ChartFormProps) {
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
    <div className="flex h-full flex-col" role="form" aria-label={chart ? "Edit Chart" : "New Chart"}>
      <div className="flex items-center gap-3 border-b border-gray-200 p-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-lg active:bg-gray-100 md:hidden"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <h2 className="text-xl font-semibold">{chart ? "Edit Chart" : "New Chart"}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <label htmlFor="chart-name" className="mb-1 block text-sm font-medium">Name</label>
          <input
            id="chart-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-3 text-base focus:border-blue-500 focus:outline-none md:py-2 md:text-sm"
            placeholder="Chart name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="chart-description" className="mb-1 block text-sm font-medium">Description</label>
          <input
            id="chart-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-3 text-base focus:border-blue-500 focus:outline-none md:py-2 md:text-sm"
            placeholder="Chart description (optional)"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="chart-data" className="mb-1 block text-sm font-medium">Chart Data (JSON)</label>
          <textarea
            id="chart-data"
            value={chartData}
            onChange={(e) => setChartData(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-3 font-mono text-base focus:border-blue-500 focus:outline-none md:py-2 md:text-sm"
            rows={12}
            placeholder='{"type": "XYChart", ...}'
          />
          {jsonError && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              Invalid JSON: {jsonError}
            </p>
          )}
        </div>

        {previewData.trim() && !jsonError && (
          <div className="mb-4" role="region" aria-label="Preview">
            <label className="mb-1 block text-sm font-medium">Preview</label>
            <div className="h-48 rounded border border-gray-200 md:h-64">
              <ChartRenderer chartData={previewData} id="chart-preview" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-gray-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          onClick={() => onSave(name, description, chartData)}
          disabled={!isValid}
          className="flex-1 rounded bg-blue-600 px-4 py-3 text-white active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed md:flex-none md:py-2 md:hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded border border-gray-300 px-4 py-3 active:bg-gray-100 md:flex-none md:py-2 md:hover:bg-gray-50"
        >
          Cancel
        </button>
        {chart && onDelete && (
          <button
            onClick={onDelete}
            className="ml-auto rounded bg-red-600 px-4 py-3 text-white active:bg-red-700 md:py-2 md:hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
