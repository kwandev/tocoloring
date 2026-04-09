import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Next.js Boilerplate</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/ssr"
          className="rounded-lg border p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          <h2 className="mb-2 text-xl font-medium">SSR 샘플</h2>
          <p className="text-sm text-zinc-500">Server Component fetch + Zustand hydrate</p>
        </Link>

        <Link
          href="/spa"
          className="rounded-lg border p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          <h2 className="mb-2 text-xl font-medium">SPA 샘플</h2>
          <p className="text-sm text-zinc-500">TanStack Query + Zustand</p>
        </Link>
      </div>
    </div>
  );
}
