import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kito Listings Marketplace',
  description:
    'Browse and manage premium listings with confidence. Submit your product, approve status updates, and explore curated selections.',
  openGraph: {
    title: 'Kito Listings Marketplace',
    description:
      'Browse and manage premium listings with confidence. Submit your product, approve status updates, and explore curated selections.',
    url: 'https://kito.example.com',
    siteName: 'Kito',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <a className="text-lg font-semibold tracking-tight" href="/">
                Kito Marketplace
              </a>
              <nav className="flex items-center gap-4 text-sm">
                <a className="hover:text-slate-200" href="/listings">
                  Explore listings
                </a>
                <a className="hover:text-slate-200" href="/sell">
                  Sell an item
                </a>
                <a className="hover:text-slate-200" href="/admin">
                  Admin
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
          <footer className="border-t border-slate-800 bg-slate-900/70">
            <div className="mx-auto max-w-5xl px-6 py-4 text-xs text-slate-400">
              © {new Date().getFullYear()} Kito Marketplace. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
