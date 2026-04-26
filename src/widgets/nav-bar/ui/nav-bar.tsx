'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

  if (pathname === '/convert' && isConverting) {
    return null;
  }

  return (
    <header className="border-border sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-8">
        <NavLogo />
      </div>
    </header>
  );
}
