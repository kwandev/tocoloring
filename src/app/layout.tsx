import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { QueryProvider } from '@/shared/providers';
import { NavBar } from '@/widgets/nav-bar';
import './globals.css';
import { cn } from '@/shared/lib/utils';

const pretendard = localFont({
  src: '../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
});

export const metadata: Metadata = {
  title: 'ToColoring — AI 색칠공부 도안 변환',
  description: '이미지를 업로드하면 AI가 색칠공부 도안으로 변환해드립니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn('h-full', 'antialiased', pretendard.variable, 'font-sans')}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <NavBar />
          <main className="">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
