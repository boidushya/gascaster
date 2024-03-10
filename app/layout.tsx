import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gascaster",
  description: "A farcaster frame to calculate how much you spent on gas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
