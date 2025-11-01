'use client';

import { useState, useTransition } from 'react';

interface FieldErrors {
  form?: string;
}

export function SellForm() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      try {
        const response = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ form: data.error || 'Unable to submit listing.' });
          return;
        }

        event.currentTarget.reset();
        setSuccessMessage('Listing submitted successfully and is pending review.');
      } catch (error) {
        setErrors({ form: (error as Error).message });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium" htmlFor="title">
            Title <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            name="title"
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Vintage electric guitar"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Share details about the listing"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="price">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="condition">
            Condition
          </label>
          <input
            id="condition"
            name="condition"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Excellent, Good, ..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="location">
            Location <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="location"
            name="location"
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Los Angeles, USA"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="category">
            Category <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="category"
            name="category"
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Guitars"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="brand">
            Brand <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="brand"
            name="brand"
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Fender"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="model">
            Model <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="model"
            name="model"
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="Stratocaster"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="year">
            Year <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="year"
            name="year"
            required
            inputMode="numeric"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="2024"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            placeholder="https://..."
          />
        </div>
      </div>
      {errors.form && <p className="text-sm text-rose-400">{errors.form}</p>}
      {successMessage && <p className="text-sm text-emerald-400">{successMessage}</p>}
      <button
        type="submit"
        className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
        disabled={isPending}
      >
        {isPending ? 'Submitting…' : 'Submit for review'}
      </button>
    </form>
  );
}
