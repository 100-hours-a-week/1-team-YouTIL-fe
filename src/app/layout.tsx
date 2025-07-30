import type { Metadata } from "next";
import "./globals.scss";
import LayoutWrapper from "@/app/layoutWrapper/LayoutWrapper";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import BackgroundImage from "@/components/background/BackgroundImage";
// import pretendard from "@/font/prentedard";

export const metadata : Metadata = {
  title: 'YouTIL - 나만의 TIL 생성 서비스',
  description: 'GitHub 커밋을 기반으로 오늘 배운 것을 기록하고 공유하세요.',
  keywords: ['TIL', '개발자 성장', 'GitHub 커밋', '면접 질문', '기술 블로그'],
  openGraph: {
    title: 'YouTIL - 오늘의 학습을 정리하세요',
    description: '나만의 TIL을 생성하고 면접 질문까지 받을 수 있는 개발자 성장 플랫폼.',
    url: 'https://youtil.co.kr',
    siteName: 'YouTIL',
    images: [
      {
        url: 'https://youtil-bucket-prod.s3.ap-northeast-2.amazonaws.com/background.png',
        width: 800,
        height: 600,
      },
    ],
        type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
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
