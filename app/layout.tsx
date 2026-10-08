import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pimisa Dispenser Control",
  description: "Manage cooking oil vouchers, customers, sales and dispensers.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
