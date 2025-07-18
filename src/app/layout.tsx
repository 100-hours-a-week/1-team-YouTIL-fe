import type { Metadata } from "next";
import "./globals.scss";
import LayoutWrapper from "@/app/layoutWrapper/LayoutWrapper";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import BackgroundImage from "@/components/background/BackgroundImage";
import pretendard from "@/font/prentedard";

export const metadata: Metadata = {
  title: "YouTIL",
  description: "YouTIL",
  icons:{
    icon: '/images/favicon.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko' className={`${pretendard.variable}`}>
      <body className={`${pretendard.className}`}>
        <BackgroundImage/>
        <LayoutWrapper>
          {children}
          <ReactQueryDevtools/>
        </LayoutWrapper>
      </body>
    </html>
  );
}
