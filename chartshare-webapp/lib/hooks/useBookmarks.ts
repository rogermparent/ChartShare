"use client";

import { useState, useEffect, useCallback } from "react";
import { BookmarkState, BookmarkGroup } from "@/lib/types";

const STORAGE_KEY = "chartshare-bookmarks";

function loadState(): BookmarkState {
  if (typeof window === "undefined") return { groups: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BookmarkState;
  } catch {}
  return { groups: [] };
}

function saveState(state: BookmarkState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useBookmarks() {
  const [state, setState] = useState<BookmarkState>({ groups: [] });

  useEffect(() => {
    setState(loadState());
  }, []);

  const persist = useCallback((next: BookmarkState) => {
    setState(next);
    saveState(next);
  }, []);

  const createGroup = useCallback(
    (name: string, initialChartId?: number) => {
      const group: BookmarkGroup = {
        id: crypto.randomUUID(),
        name,
        chartIds: initialChartId !== undefined ? [initialChartId] : [],
      };
      persist({ groups: [...state.groups, group] });
      return group;
    },
    [state, persist]
  );

  const deleteGroup = useCallback(
    (groupId: string) => {
      persist({ groups: state.groups.filter((g) => g.id !== groupId) });
    },
    [state, persist]
  );

  const renameGroup = useCallback(
    (groupId: string, name: string) => {
      persist({
        groups: state.groups.map((g) => (g.id === groupId ? { ...g, name } : g)),
      });
    },
    [state, persist]
  );

  const addChartToGroup = useCallback(
    (groupId: string, chartId: number) => {
      persist({
        groups: state.groups.map((g) =>
          g.id === groupId && !g.chartIds.includes(chartId)
            ? { ...g, chartIds: [...g.chartIds, chartId] }
            : g
        ),
      });
    },
    [state, persist]
  );

  const removeChartFromGroup = useCallback(
    (groupId: string, chartId: number) => {
      persist({
        groups: state.groups.map((g) =>
          g.id === groupId
            ? { ...g, chartIds: g.chartIds.filter((id) => id !== chartId) }
            : g
        ),
      });
    },
    [state, persist]
  );

  const isChartInGroup = useCallback(
    (groupId: string, chartId: number) => {
      const group = state.groups.find((g) => g.id === groupId);
      return group ? group.chartIds.includes(chartId) : false;
    },
    [state]
  );

  const exportGroups = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importGroups = useCallback(
    (json: string) => {
      const parsed = JSON.parse(json) as BookmarkState;
      if (!Array.isArray(parsed.groups)) throw new Error("Invalid bookmark data");
      for (const g of parsed.groups) {
        if (!g.id || !g.name || !Array.isArray(g.chartIds)) {
          throw new Error("Invalid group structure");
        }
      }
      persist(parsed);
    },
    [persist]
  );

  return {
    groups: state.groups,
    createGroup,
    deleteGroup,
    renameGroup,
    addChartToGroup,
    removeChartFromGroup,
    isChartInGroup,
    exportGroups,
    importGroups,
  };
}
