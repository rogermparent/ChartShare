"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { JsonParser } from "@amcharts/amcharts5/plugins/json";

interface ChartRendererProps {
  chartData: string;
  id: string;
}

export default function ChartRenderer({ chartData, id }: ChartRendererProps) {
  const rootRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    const root = am5.Root.new(id);
    rootRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const parser = JsonParser.new(root);
    parser.parse(JSON.parse(chartData), {
      parent: root.container,
    });

    return () => {
      root.dispose();
      rootRef.current = null;
    };
  }, [chartData, id]);

  return <div id={id} style={{ width: "100%", height: "100%" }} />;
}
