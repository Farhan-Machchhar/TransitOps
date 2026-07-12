import type { Metadata } from 'next';
import './globals.css';
import Providers from './components/Providers';

export const metadata: Metadata = {
  title: 'TransitOps',
  description: 'Logistics Operations Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 text-white font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
