import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Marsel Tazhibayev — Backend Developer",
  description:
    "Backend-focused Developer (Go / Fullstack). Experienced in Go concurrency and designing scalable backend architectures for high-load tasks.",
  keywords: ["Go", "Golang", "Backend", "gRPC", "Microservices", "Astana", "Kazakhstan"],
  authors: [{ name: "Marsel Tazhibayev" }],
  openGraph: {
    title: "Marsel Tazhibayev — Backend Developer",
    description: "Go / Fullstack · High-Load Backend Engineer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
