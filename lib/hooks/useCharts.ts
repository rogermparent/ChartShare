"use client";

import { useState, useCallback, useEffect } from "react";
import { ChartRecord } from "@/lib/types";

export function useCharts() {
  const [charts, setCharts] = useState<ChartRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCharts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/charts");
      const data = await res.json();
      console.log({ data });
      setCharts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharts();
  }, [fetchCharts]);

  const createChart = useCallback(
    async (name: string, description: string, chartData: string) => {
      const res = await fetch("/api/charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, chartData }),
      });
      const created = await res.json();
      await fetchCharts();
      return created as ChartRecord;
    },
    [fetchCharts],
  );

  const updateChart = useCallback(
    async (
      id: number,
      data: Partial<Pick<ChartRecord, "name" | "description" | "chartData">>,
    ) => {
      const res = await fetch(`/api/charts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      await fetchCharts();
      return updated as ChartRecord;
    },
    [fetchCharts],
  );

  const deleteChart = useCallback(
    async (id: number) => {
      await fetch(`/api/charts/${id}`, { method: "DELETE" });
      await fetchCharts();
    },
    [fetchCharts],
  );

  return {
    charts,
    loading,
    fetchCharts,
    createChart,
    updateChart,
    deleteChart,
  };
}
