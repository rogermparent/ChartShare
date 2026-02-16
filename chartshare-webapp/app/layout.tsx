import { Geist, Geist_Mono } from "next/font/google";
import { RootLayout, layoutMetadata, layoutViewport } from "chartshare-common/lib/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = layoutMetadata;
export const viewport = layoutViewport;

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout fontClassName={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </RootLayout>
  );
}
