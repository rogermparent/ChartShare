import type { MetadataRoute } from "next";

export const baseManifest: MetadataRoute.Manifest = {
  id: "chartshare",
  name: "ChartShare",
  short_name: "ChartShare",
  description: "Chart management PWA powered by AmCharts 5",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#2563eb",
  icons: [
    {
      src: "/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  screenshots: [
    {
      src: "/screenshot-mobile.png",
      sizes: "1242x2688",
    },
    {
      src: "/screenshot-desktop.png",
      form_factor: "wide",
      sizes: "2560x1600",
    },
  ],
};
