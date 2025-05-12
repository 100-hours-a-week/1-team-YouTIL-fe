import type { Metadata } from "next";
import "./globals.scss";
import LayoutWrapper from "@/components/layoutWrapper/LayoutWrapper";

export const metadata: Metadata = {
  title: "YouTIL",
  description: "YouTIL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
