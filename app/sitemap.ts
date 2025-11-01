import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kito.example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/listings', '/sell', '/admin'];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date()
  }));
}
