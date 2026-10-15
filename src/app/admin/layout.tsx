import type { Metadata } from "next";

// Admin pages are for the team only, so ask search engines not to list them.
export const metadata: Metadata = {
  title: "Admin — Recycling Schedule",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
