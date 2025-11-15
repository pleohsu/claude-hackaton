'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-ocean-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🦐</span>
              <span className="text-xl font-bold">ShellCycle</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about')
                  ? 'bg-ocean-800 text-white'
                  : 'text-ocean-100 hover:bg-ocean-600'
              }`}
            >
              About
            </Link>
            <Link
              href="/register/restaurant"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/register/restaurant')
                  ? 'bg-ocean-800 text-white'
                  : 'text-ocean-100 hover:bg-ocean-600'
              }`}
            >
              Restaurant Sign Up
            </Link>
            <Link
              href="/register/lab"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/register/lab')
                  ? 'bg-ocean-800 text-white'
                  : 'text-ocean-100 hover:bg-ocean-600'
              }`}
            >
              Lab Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
