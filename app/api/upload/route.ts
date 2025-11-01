import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

import { assertAdminAccess } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!assertAdminAccess(request)) {
    console.log('[API /upload] denied');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof Blob)) {
      console.log('[API /upload] missing file');
      return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = formData.get('filename')?.toString() || `listing-${Date.now()}`;

    const stored = await put(filename, buffer, {
      access: 'public',
      contentType: file.type || 'application/octet-stream'
    });

    return NextResponse.json({ url: stored.url });
  } catch (error) {
    console.error('[API /upload] error', (error as Error).message);
    return NextResponse.json({ error: 'Unable to upload file' }, { status: 500 });
  }
}
