import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Forest Race (포레스트 레이스) - Patience is the only way to win',
  description: '전 세계 유저가 방치와 수확을 통해 자국의 숲을 키우는 글로벌 국가 대항전 게임',
  keywords: ['Forest Race', 'Global Forest', 'Idle Game', 'Upstash Redis', 'Next.js', '방치형 게임'],
  openGraph: {
    title: 'Forest Race - Global Idle National Competition',
    description: 'Patience is the only way to win. Nurture your nation’s tree together.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased selection:bg-yellow-400/30 selection:text-yellow-200">
        {children}
      </body>
    </html>
  );
}
