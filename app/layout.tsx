import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 기초 수요조사 | C-레벨 & 개발자",
  description:
    "C-레벨과 개발자를 위한 AI 기초 강의 수요조사 페이지. 응답 결과는 이메일로 전송됩니다."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
