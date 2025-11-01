import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createListing,
  getAllListings,
  getApprovedListings
} from '@/lib/listings';
import { assertAdminAccess } from '@/lib/admin';
import { allowRequest, getClientKey } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const querySchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  includeAll: z
    .string()
    .optional()
    .transform((value) => value === 'true')
});

const positiveNumber = z
  .coerce
  .number()
  .refine((value) => !Number.isNaN(value), 'Value must be a number');

const payloadSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z
    .preprocess((value) => (value === '' || value === null ? undefined : value), positiveNumber.min(0))
    .optional(),
  condition: z.string().optional().nullable(),
  location: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z
    .preprocess((value) => (value === '' || value === null ? undefined : value), positiveNumber)
    .optional(),
  imageUrl: z.string().url().optional().nullable()
});

function validationError(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryObject = Object.fromEntries(searchParams.entries());

  const result = querySchema.safeParse(queryObject);

  if (!result.success) {
    const message = result.error.flatten().formErrors.join(', ') || 'Invalid query parameters';
    console.log('[API /listings] invalid query params', message);
    return validationError(message);
  }

  const { includeAll, ...filters } = result.data;

  try {
    if (includeAll) {
      if (!assertAdminAccess(request)) {
        console.log('[API /listings] includeAll denied');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const listings = await getAllListings();
      return NextResponse.json({ listings });
    }

    const listings = await getApprovedListings(filters);
    return NextResponse.json({ listings });
  } catch (error) {
    console.error('[API /listings] GET error', (error as Error).message);
    return NextResponse.json({ error: 'Unable to fetch listings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  if (!allowRequest(clientKey)) {
    console.log('[API /listings] rate limited', clientKey);
    return NextResponse.json(
      { error: 'Please wait a moment before submitting again.' },
      { status: 429 }
    );
  }

  try {
    const json = await request.json();
    const parsed = payloadSchema.safeParse(json);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const message =
        Object.values(flattened.fieldErrors)
          .flat()
          .join(', ') || 'Invalid listing payload';
      console.log('[API /listings] validation failed', message);
      return validationError(message);
    }

    const listing = await createListing({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      price: parsed.data.price ?? null,
      condition: parsed.data.condition ?? null,
      location: parsed.data.location,
      category: parsed.data.category,
      brand: parsed.data.brand,
      model: parsed.data.model,
      year: parsed.data.year ? Math.round(parsed.data.year) : null,
      imageUrl: parsed.data.imageUrl ?? null
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error('[API /listings] POST error', (error as Error).message);
    return NextResponse.json({ error: 'Unable to create listing' }, { status: 500 });
  }
}
