import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome to Kito</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Submit, review, and explore curated listings with a streamlined workflow
          designed for marketplace operators and admins.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link
            className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-emerald-950 shadow hover:bg-emerald-400"
            href="/sell"
          >
            Create a listing
          </Link>
          <Link
            className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-200 hover:border-slate-500"
            href="/listings"
          >
            Explore listings
          </Link>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Admin oversight</h2>
          <p className="mt-3 text-sm text-slate-300">
            Secure admin workflows backed by API guards, rate-limited actions, and
            clear audit logging so your team stays in control.
          </p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Seller-friendly submissions</h2>
          <p className="mt-3 text-sm text-slate-300">
            Client-side validation and inline feedback help sellers complete forms
            accurately before submitting their listing for review.
          </p>
        </article>
      </section>
    </div>
  );
}
