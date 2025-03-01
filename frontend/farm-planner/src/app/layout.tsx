import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farm Planner",
  description: "Created for Hacktopia 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
