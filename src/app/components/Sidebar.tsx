'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '🏠 Dashboard' },
  { href: '/trips', label: '🚛 Trips' },
  { href: '/vehicles', label: '🚗 Vehicles' },
  { href: '/drivers', label: '👤 Drivers' },
  { href: '/maintenance', label: '🔧 Maintenance' },
  { href: '/reports', label: '📊 Reports' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-gray-900 bg-opacity-90 text-white flex flex-col p-4 border-r border-gray-700 min-h-screen">
      <div className="mb-8 text-2xl font-bold text-center tracking-wide text-blue-400">
        TransitOps
      </div>
      <nav className="flex flex-col space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
