import type { Metadata } from "next";
import "./globals.css";
import WatermarkFooter from "../components/WatermarkFooter";

export const metadata: Metadata = {
  title: "Petabytes",
  description: "One hub for all your mcp needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <WatermarkFooter />
      </body>
    </html>
  );
}
