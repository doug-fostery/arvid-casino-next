import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arvid's Salary Casino",
  description: 'Win back your salary (probably not)',
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
      </body>
    </html>
  );
}