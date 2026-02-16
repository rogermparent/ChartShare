"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import ChartForm from "@/components/ChartForm";
import BookmarkManager from "@/components/BookmarkManager";
import { useCharts } from "@/lib/hooks/useCharts";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { ChartRecord } from "@/lib/types";

const ChartRenderer = dynamic(() => import("@/components/ChartRenderer"), { ssr: false });

type ViewMode = "view" | "create" | "edit";
type MobileView = "library" | "chart" | "form";

export default function Home() {
  const { charts, loading, createChart, updateChart, deleteChart } = useCharts();
  const bookmarks = useBookmarks();

  const [selectedChart, setSelectedChart] = useState<ChartRecord | null>(null);
  const [mode, setMode] = useState<ViewMode>("view");
  const [mobileView, setMobileView] = useState<MobileView>("library");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const handleSelect = (chart: ChartRecord) => {
    setSelectedChart(chart);
    setMode("view");
    setMobileView("chart");
  };

  const handleNew = () => {
    setSelectedChart(null);
    setMode("create");
    setMobileView("form");
  };

  const handleSaveCreate = async (name: string, description: string, chartData: string) => {
    const created = await createChart(name, description, chartData);
    setSelectedChart(created);
    setMode("view");
    setMobileView("chart");
  };

  const handleSaveEdit = async (name: string, description: string, chartData: string) => {
    if (!selectedChart) return;
    const updated = await updateChart(selectedChart.id, { name, description, chartData });
    setSelectedChart(updated);
    setMode("view");
    setMobileView("chart");
  };

  const handleDelete = async () => {
    if (!selectedChart) return;
    await deleteChart(selectedChart.id);
    setSelectedChart(null);
    setMode("view");
    setMobileView("library");
  };

  const handleEdit = () => {
    setMode("edit");
    setMobileView("form");
  };

  const handleBackToLibrary = () => {
    setMobileView("library");
    setMode("view");
  };

  const handleBackToChart = () => {
    setMobileView("chart");
    setMode("view");
  };

  const handleFormCancel = () => {
    setMode("view");
    setMobileView(selectedChart ? "chart" : "library");
  };

  return (
    <div className="flex h-dvh md:h-screen">
      {/* Sidebar: visible when mobileView=library on mobile, always visible on desktop */}
      <div
        className={`${mobileView === "library" ? "flex" : "hidden"} w-full flex-col md:flex md:w-72 md:shrink-0`}
      >
        <Sidebar
          charts={charts}
          loading={loading}
          selectedId={selectedChart?.id ?? null}
          onSelect={handleSelect}
          onNew={handleNew}
          bookmarkGroups={bookmarks.groups}
          activeGroupId={activeGroupId}
          onGroupChange={setActiveGroupId}
        />
      </div>

      {/* Main content: visible when mobileView != library on mobile, always visible on desktop */}
      <main
        className={`${mobileView !== "library" ? "flex" : "hidden"} min-w-0 flex-1 flex-col md:flex`}
        data-testid="main-content"
      >
        {mode === "create" && (
          <ChartForm
            onSave={handleSaveCreate}
            onCancel={handleFormCancel}
            onBack={handleBackToLibrary}
          />
        )}

        {mode === "edit" && selectedChart && (
          <ChartForm
            chart={selectedChart}
            onSave={handleSaveEdit}
            onCancel={handleFormCancel}
            onDelete={handleDelete}
            onBack={handleBackToChart}
          />
        )}

        {mode === "view" && selectedChart && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToLibrary}
                  className="flex h-11 w-11 items-center justify-center rounded-lg active:bg-gray-100 md:hidden"
                  aria-label="Back to library"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl font-semibold" data-testid="chart-title">
                    {selectedChart.name}
                  </h1>
                  {selectedChart.description && (
                    <p className="text-sm text-gray-500" data-testid="chart-description">
                      {selectedChart.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookmarkManager
                  chartId={selectedChart.id}
                  groups={bookmarks.groups}
                  isChartInGroup={bookmarks.isChartInGroup}
                  addChartToGroup={bookmarks.addChartToGroup}
                  removeChartFromGroup={bookmarks.removeChartFromGroup}
                  createGroup={bookmarks.createGroup}
                  deleteGroup={bookmarks.deleteGroup}
                  exportGroups={bookmarks.exportGroups}
                  importGroups={bookmarks.importGroups}
                />
                <button
                  data-testid="edit-chart-btn"
                  onClick={handleEdit}
                  className="rounded border border-gray-300 px-3 py-1.5 text-sm active:bg-gray-100 md:hover:bg-gray-50"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex-1" data-testid="chart-container">
              <ChartRenderer chartData={selectedChart.chartData} id={`chart-${selectedChart.id}`} />
            </div>
          </div>
        )}

        {mode === "view" && !selectedChart && (
          <div className="flex h-full items-center justify-center" data-testid="empty-state">
            <p className="text-gray-500">Select a chart or create a new one</p>
          </div>
        )}
      </main>
    </div>
  );
}
