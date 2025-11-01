'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

import type { Listing } from '@/lib/listings';
import { ListingCard } from '../components/ListingCard';

interface ListingsViewProps {
  listings: Listing[];
  initialFilters: {
    category?: string;
    location?: string;
    brand?: string;
    model?: string;
    year?: string;
  };
}

export function ListingsView({ listings, initialFilters }: ListingsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    location: initialFilters.location || '',
    brand: initialFilters.brand || '',
    model: initialFilters.model || '',
    year: initialFilters.year || ''
  });

  const hasFilters = useMemo(() => Object.values(filters).some((value) => value.trim() !== ''), [filters]);

  const updateQuery = (nextFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    startTransition(() => {
      const query = params.toString();
      router.push(query ? `/listings?${query}` : '/listings');
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQuery(filters);
  };

  const handleClear = () => {
    const cleared = { category: '', location: '', brand: '', model: '', year: '' };
    setFilters(cleared);
    startTransition(() => {
      router.push('/listings');
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="brand">
              Brand <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="brand"
              name="brand"
              required={false}
              value={filters.brand}
              onChange={(event) => setFilters((prev) => ({ ...prev, brand: event.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              placeholder="Fender, Yamaha, etc."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="model">
              Model <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="model"
              name="model"
              required={false}
              value={filters.model}
              onChange={(event) => setFilters((prev) => ({ ...prev, model: event.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              placeholder="Model"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              name="category"
              value={filters.category}
              onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              placeholder="Guitars, Keyboards, ..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              value={filters.location}
              onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              placeholder="City, Country"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="year">
              Year
            </label>
            <input
              id="year"
              name="year"
              value={filters.year}
              onChange={(event) => setFilters((prev) => ({ ...prev, year: event.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              placeholder="2024"
              inputMode="numeric"
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
            >
              Apply filters
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
              >
                Clear filters
              </button>
            )}
            {isPending && <span className="text-xs text-slate-400">Loading…</span>}
          </div>
        </form>
      </section>
      {listings.length === 0 ? (
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <p className="text-lg font-semibold">No listings match your filters.</p>
          <p className="text-sm text-slate-300">
            Try adjusting your filters or submit a listing to get started.
          </p>
          <Link
            href="/sell"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
          >
            Create a listing
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
