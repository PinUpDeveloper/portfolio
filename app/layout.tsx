import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
