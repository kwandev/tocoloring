'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { useConvertStore } from '@/features/convert';

function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="bg-primary inline-block size-5 rounded-sm" />
      <span>ToColoring</span>
    </Link>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const isConverting = useConvertStore((s) => s.isConverting);

  // 로딩 상태에서는 NavBar를 숨긴다
  if (pathname === '/convert' && isConverting) {
    return null;
  }

  return (
    <header className="border-border sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-8">
        <NavLogo />
        <div className="flex-1" />
        <nav className="text-muted-foreground hidden items-center gap-5 text-sm md:flex">
          <button type="button" className="hover:text-foreground transition">
            어떻게 만들어요?
          </button>
          <button type="button" className="hover:text-foreground transition">
            요금
          </button>
          <button type="button" className="hover:text-foreground transition">
            갤러리
          </button>
          <button type="button" className="hover:text-foreground transition">
            FAQ
          </button>
        </nav>
        <div className="flex-1" />
        <Button variant="ghost" size="sm">
          로그인
        </Button>
      </div>
    </header>
  );
}
