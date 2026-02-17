"use client";
import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChartRecord } from "../types";

export function useChartUrlSync(
  charts: ChartRecord[],
  loading: boolean,
  onSelect: (chart: ChartRecord) => void,
) {
  const searchParams = useSearchParams();
  const chartIdParam = searchParams.get("chart");

  // On mount (after charts load): restore selection from URL
  useEffect(() => {
    if (loading || !chartIdParam) return;
    const id = Number(chartIdParam);
    const chart = charts.find((c) => c.id === id);
    if (chart) onSelect(chart);
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const setChartParam = useCallback((id: number) => {
    window.history.replaceState(null, "", `?chart=${id}`);
  }, []);

  const clearChartParam = useCallback(() => {
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  return { setChartParam, clearChartParam };
}
