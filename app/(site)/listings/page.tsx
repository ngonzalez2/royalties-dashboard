import { getApprovedListings } from '@/lib/listings';
import { ListingsView } from './ListingsView';

interface ListingsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const filters = {
    category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
    location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
    brand: typeof searchParams.brand === 'string' ? searchParams.brand : undefined,
    model: typeof searchParams.model === 'string' ? searchParams.model : undefined,
    year: typeof searchParams.year === 'string' ? searchParams.year : undefined
  };

  const listings = await getApprovedListings(filters);

  return <ListingsView listings={listings} initialFilters={filters} />;
}
