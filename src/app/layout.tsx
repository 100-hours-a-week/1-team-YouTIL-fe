import type { Metadata } from "next";
import "./globals.scss";
import LayoutWrapper from "@/app/layoutWrapper/LayoutWrapper";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import BackgroundImage from "@/components/background/BackgroundImage";
export const metadata: Metadata = {
  title: "YouTIL",
  description: "YouTIL",
  icons:{
    icon: '/images/favicon.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BackgroundImage/>
        <LayoutWrapper>
          {children}
          <ReactQueryDevtools/>
        </LayoutWrapper>
      </body>
    </html>
  );
}
