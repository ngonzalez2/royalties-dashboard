import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
      <h1 className="text-3xl font-semibold">We couldn’t find that page</h1>
      <p className="text-slate-300">
        The content you are looking for might have been moved or no longer exists.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 shadow hover:bg-emerald-400"
      >
        Return home
      </Link>
    </div>
  );
}
