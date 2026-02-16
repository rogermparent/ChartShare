export interface ChartRecord {
  id: number;
  name: string;
  description: string;
  chartData: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BookmarkGroup {
  id: string;
  name: string;
  chartIds: number[];
}

export interface BookmarkState {
  groups: BookmarkGroup[];
}
