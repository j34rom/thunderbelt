import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recycling Schedule",
  description: "Find when and where to take your recyclables in your area.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
