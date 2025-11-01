import { sql } from '@vercel/postgres';
import type { QueryResultRow } from '@vercel/postgres';

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export interface ListingRow extends QueryResultRow {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  condition: string | null;
  location: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  image_url: string | null;
  status: ListingStatus;
  created_at: string | Date;
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  condition: string | null;
  location: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  imageUrl: string | null;
  status: ListingStatus;
  createdAt: Date;
}

export interface ListingFilters {
  category?: string | null;
  location?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: string | number | null;
}

const fallbackResult: Listing[] = [];

function dbAvailable() {
  return Boolean(
    process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING
  );
}

export function normalizeListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price === null || row.price === undefined ? null : Number(row.price),
    condition: row.condition,
    location: row.location,
    category: row.category,
    brand: row.brand,
    model: row.model,
    year: row.year === null || row.year === undefined ? null : Number(row.year),
    imageUrl: row.image_url,
    status: row.status,
    createdAt: new Date(row.created_at)
  };
}

function sanitizeFilter(value?: string | number | null) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
}

export async function getApprovedListings(filters: ListingFilters = {}) {
  if (!dbAvailable()) {
    console.log('[DB getApprovedListings] database not configured, returning empty list');
    return fallbackResult;
  }
  const normalizedFilters = {
    category: sanitizeFilter(filters.category),
    location: sanitizeFilter(filters.location),
    brand: sanitizeFilter(filters.brand),
    model: sanitizeFilter(filters.model),
    year: sanitizeFilter(filters.year)
  };

  const clauses = [sql`status = 'approved'`];

  if (normalizedFilters.category) {
    clauses.push(sql`category::text ILIKE ${`%${normalizedFilters.category}%`}`);
  }

  if (normalizedFilters.location) {
    clauses.push(sql`location::text ILIKE ${`%${normalizedFilters.location}%`}`);
  }

  if (normalizedFilters.brand) {
    clauses.push(sql`brand::text ILIKE ${`%${normalizedFilters.brand}%`}`);
  }

  if (normalizedFilters.model) {
    clauses.push(sql`model::text ILIKE ${`%${normalizedFilters.model}%`}`);
  }

  if (normalizedFilters.year) {
    clauses.push(sql`year::text = ${`${normalizedFilters.year}`}`);
  }

  const where = sql`WHERE ${sql.join(clauses, sql` AND `)}`;

  try {
    const result = await sql<ListingRow>`SELECT * FROM listings ${where} ORDER BY created_at DESC`;
    return result.rows.map((row) => normalizeListing(row));
  } catch (error) {
    console.error('[DB getApprovedListings]', (error as Error).message);
    return fallbackResult;
  }
}

export async function getAllListings() {
  if (!dbAvailable()) {
    console.log('[DB getAllListings] database not configured, returning empty list');
    return fallbackResult;
  }
  try {
    const result = await sql<ListingRow>`SELECT * FROM listings ORDER BY created_at DESC`;
    return result.rows.map((row) => normalizeListing(row));
  } catch (error) {
    console.error('[DB getAllListings]', (error as Error).message);
    return fallbackResult;
  }
}

export async function getListingById(id: string) {
  if (!dbAvailable()) {
    console.log('[DB getListingById] database not configured, returning null');
    return null;
  }
  try {
    const result = await sql<ListingRow>`SELECT * FROM listings WHERE id = ${id} LIMIT 1`;
    const row = result.rows[0];
    return row ? normalizeListing(row) : null;
  } catch (error) {
    console.error('[DB getListingById]', (error as Error).message);
    return null;
  }
}

export interface CreateListingInput {
  title: string;
  description: string | null;
  price: number | null;
  condition: string | null;
  location: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  imageUrl: string | null;
}

export async function createListing(input: CreateListingInput) {
  if (!dbAvailable()) {
    console.log('[DB createListing] database not configured');
    throw new Error('Database not configured');
  }
  try {
    const result = await sql<ListingRow>`
      INSERT INTO listings (title, description, price, condition, location, category, brand, model, year, image_url, status)
      VALUES (
        ${input.title},
        ${input.description},
        ${input.price},
        ${input.condition},
        ${input.location},
        ${input.category},
        ${input.brand},
        ${input.model},
        ${input.year},
        ${input.imageUrl},
        'pending'
      )
      RETURNING *
    `;

    return normalizeListing(result.rows[0]);
  } catch (error) {
    console.error('[DB createListing]', (error as Error).message);
    throw error;
  }
}

export async function updateListingStatus(id: string, status: ListingStatus) {
  if (!dbAvailable()) {
    console.log('[DB updateListingStatus] database not configured');
    throw new Error('Database not configured');
  }
  try {
    const result = await sql<ListingRow>`
      UPDATE listings SET status = ${status} WHERE id = ${id} RETURNING *
    `;
    const row = result.rows[0];
    return row ? normalizeListing(row) : null;
  } catch (error) {
    console.error('[DB updateListingStatus]', (error as Error).message);
    throw error;
  }
}
