'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-slate-300">
            We hit an unexpected error. Please try again or head back to the
            homepage.
          </p>
          <div className="flex justify-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-emerald-950 hover:bg-emerald-400"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-200 hover:border-slate-500"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
