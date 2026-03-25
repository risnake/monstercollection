import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monster Energy Collection",
  description: "A digital showcase of my Monster Energy collection and tier rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
