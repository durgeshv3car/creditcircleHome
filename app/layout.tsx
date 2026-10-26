import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import "./theme.css";

import { RootClientWrapper } from "./ClientTheme";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashcode admin Template",
  description: "created by codeshaper",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={plusJakartaSans.variable}
    >
      <body className={`${plusJakartaSans.variable} font-sans text-neutral-900`}>
        <RootClientWrapper>{children}</RootClientWrapper>
      </body>
    </html>
  );
}
