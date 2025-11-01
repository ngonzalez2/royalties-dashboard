import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { assertAdminAccess } from '@/lib/admin';
import { getClientKey, allowRequest } from '@/lib/rateLimit';
import { updateListingStatus } from '@/lib/listings';

export const runtime = 'nodejs';

const bodySchema = z.object({
  status: z.enum(['approved', 'rejected'])
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!assertAdminAccess(request)) {
    console.log('[API /listings/:id/status] denied');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientKey = getClientKey(request);
  if (!allowRequest(`${clientKey}-${params.id}`)) {
    console.log('[API /listings/:id/status] rate limited', clientKey);
    return NextResponse.json(
      { error: 'Please wait a moment before submitting again.' },
      { status: 429 }
    );
  }

  try {
    const payload = await request.json();
    const parsed = bodySchema.safeParse(payload);

    if (!parsed.success) {
      const message = parsed.error.flatten().formErrors.join(', ') || 'Invalid status payload';
      console.log('[API /listings/:id/status] validation failed', message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const updated = await updateListingStatus(params.id, parsed.data.status);

    if (!updated) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    revalidatePath('/admin');
    revalidatePath('/listings');

    return NextResponse.json({ listing: updated });
  } catch (error) {
    console.error('[API /listings/:id/status] error', (error as Error).message);
    return NextResponse.json({ error: 'Unable to update listing status' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Use PATCH to update listing status' },
    { status: 405 }
  );
}

// TODO: consider extracting shared rate limiter if additional mutating routes are added.
