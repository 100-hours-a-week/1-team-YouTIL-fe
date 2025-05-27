import type { Metadata } from "next";
import "./globals.scss";
import LayoutWrapper from "@/app/layoutWrapper/LayoutWrapper";

export const metadata: Metadata = {
  title: "YouTIL",
  description: "YouTIL",
  icons:{
    icon: '/favicon.png'
  }
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
