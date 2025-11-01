'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';

import type { Listing } from '@/lib/listings';

interface ApiError {
  error?: string;
}

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState('Enter your admin key to continue.');
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem('ADMIN_KEY');
    if (stored) {
      setAdminKey(stored);
    }
  }, []);

  const fetchListings = useCallback(
    async (key: string) => {
      if (!key) {
        setError('Enter your admin key to continue.');
        setListings([]);
        return;
      }

      try {
        setError('');
        const response = await fetch('/api/listings?includeAll=true', {
          method: 'GET',
          headers: {
            'x-admin-key': key,
            'cache-control': 'no-store'
          },
          cache: 'no-store'
        });
        const data = (await response.json()) as { listings?: Listing[] } & ApiError;

        if (!response.ok) {
          setListings([]);
          setError(data.error || 'Unable to load listings.');
          return;
        }

        setListings(data.listings || []);
        window.localStorage.setItem('ADMIN_KEY', key);
      } catch (err) {
        setError((err as Error).message);
      }
    },
    []
  );

  useEffect(() => {
    if (adminKey) {
      startTransition(() => {
        void fetchListings(adminKey);
      });
    }
  }, [adminKey, fetchListings]);

  const handleKeySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('adminKey')?.toString() || '';
    setAdminKey(value);
    startTransition(() => {
      void fetchListings(value);
    });
  };

  const handleSignOut = () => {
    window.localStorage.removeItem('ADMIN_KEY');
    setAdminKey('');
    setListings([]);
    setError('Admin key cleared. Enter your key to continue.');
    setActionMessage('');
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    if (!adminKey) {
      setError('Admin key required.');
      return;
    }

    try {
      setActionMessage('');
      const response = await fetch(`/api/listings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'x-admin-key': adminKey,
          'cache-control': 'no-store'
        },
        cache: 'no-store',
        body: JSON.stringify({ status })
      });
      const data = (await response.json()) as ApiError;

      if (!response.ok) {
        setError(data.error || 'Unable to update status');
        return;
      }

      setActionMessage(`Listing ${status}.`);
      await fetchListings(adminKey);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const pendingListings = useMemo(
    () => listings.filter((listing) => listing.status === 'pending'),
    [listings]
  );

  const approvedListings = useMemo(
    () => listings.filter((listing) => listing.status === 'approved'),
    [listings]
  );

  return (
    <div className="space-y-6">
      <form className="flex flex-wrap gap-3" onSubmit={handleKeySubmit}>
        <label className="flex flex-col gap-1 text-sm" htmlFor="adminKey">
          Admin key
          <input
            id="adminKey"
            name="adminKey"
            required
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            className="min-w-[240px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Enter key"
            aria-describedby="admin-key-help"
          />
        </label>
        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
          >
            Authenticate
          </button>
          <button
            type="button"
            onClick={() => startTransition(() => void fetchListings(adminKey))}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-rose-500/60 px-4 py-2 text-sm text-rose-300 hover:border-rose-400"
          >
            Sign out
          </button>
        </div>
      </form>
      <p id="admin-key-help" className="text-xs text-slate-400">
        Requests are fetched with cache disabled to ensure the latest moderation state.
      </p>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      {actionMessage && <p className="text-sm text-emerald-400">{actionMessage}</p>}
      {isPending && (
        <div className="table-skeleton">
          <div />
          <div />
          <div />
        </div>
      )}
      {!isPending && listings.length > 0 && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold">Pending listings</h2>
            {pendingListings.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No pending listings 🎉</p>
            ) : (
              <table className="mt-4 w-full table-auto text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="py-2">Title</th>
                    <th className="py-2">Brand / Model</th>
                    <th className="py-2">Year</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {pendingListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-slate-900/70">
                      <td className="py-2">{listing.title}</td>
                      <td className="py-2 text-slate-300">
                        {listing.brand || '—'} / {listing.model || '—'}
                      </td>
                      <td className="py-2">{listing.year ?? '—'}</td>
                      <td className="py-2">
                        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-200">
                          {listing.status}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-emerald-500/40 px-3 py-1 text-xs font-medium text-emerald-300 hover:border-emerald-400"
                            onClick={() => void handleStatusChange(listing.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-rose-500/60 px-3 py-1 text-xs font-medium text-rose-300 hover:border-rose-400"
                            onClick={() => void handleStatusChange(listing.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-xl font-semibold">Approved listings</h2>
            {approvedListings.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">No approved listings yet.</p>
            ) : (
              <table className="mt-4 w-full table-auto text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="py-2">Title</th>
                    <th className="py-2">Brand / Model</th>
                    <th className="py-2">Year</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {approvedListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-slate-900/70">
                      <td className="py-2">{listing.title}</td>
                      <td className="py-2 text-slate-300">
                        {listing.brand || '—'} / {listing.model || '—'}
                      </td>
                      <td className="py-2">{listing.year ?? '—'}</td>
                      <td className="py-2">
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-200">
                          {listing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
