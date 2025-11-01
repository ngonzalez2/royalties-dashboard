'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { Listing } from '@/lib/listings';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [errored, setErrored] = useState(false);
  const imageSrc = !errored && listing.imageUrl ? listing.imageUrl : '/placeholder.svg';

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
      <div className="relative h-60 w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <Image
          src={imageSrc}
          alt={listing.title || 'Listing image'}
          fill
          sizes="(min-width: 768px) 280px, 100vw"
          className="object-cover"
          onError={() => setErrored(true)}
        />
      </div>
      <div className="space-y-2">
        <header className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-slate-100">{listing.title}</h3>
          <p className="text-sm text-slate-400">
            {listing.brand && listing.model
              ? `${listing.brand} • ${listing.model}`
              : listing.brand || listing.model || 'Unspecified'}
            {listing.year ? ` • ${listing.year}` : ''}
          </p>
        </header>
        {listing.description && (
          <p className="text-sm text-slate-300">{listing.description}</p>
        )}
        <dl className="grid grid-cols-2 gap-2 text-xs text-slate-400">
          {listing.price !== null && (
            <div>
              <dt className="uppercase tracking-wide text-slate-500">Price</dt>
              <dd className="text-slate-100">${listing.price.toLocaleString()}</dd>
            </div>
          )}
          {listing.condition && (
            <div>
              <dt className="uppercase tracking-wide text-slate-500">Condition</dt>
              <dd className="text-slate-100">{listing.condition}</dd>
            </div>
          )}
          {listing.location && (
            <div>
              <dt className="uppercase tracking-wide text-slate-500">Location</dt>
              <dd className="text-slate-100">{listing.location}</dd>
            </div>
          )}
          {listing.category && (
            <div>
              <dt className="uppercase tracking-wide text-slate-500">Category</dt>
              <dd className="text-slate-100">{listing.category}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}
