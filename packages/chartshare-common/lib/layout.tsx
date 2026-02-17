import type { Metadata, Viewport } from "next";

export const layoutMetadata: Metadata = {
  title: "ChartShare",
  description: "Chart management PWA powered by AmCharts 5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ChartShare",
  },
};

export const layoutViewport: Viewport = {
  themeColor: "#2563eb",
  viewportFit: "cover",
};

export function RootLayout({
  children,
  fontClassName,
}: Readonly<{
  children: React.ReactNode;
  fontClassName: string;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontClassName} antialiased bg-slate-100 color-slate-950 dark:bg-slate-950 dark:color-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
