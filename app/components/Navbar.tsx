'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'restaurant' | 'lab';
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    checkSession();
  }, [pathname]);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

            {!isLoading && (
              <>
                {user ? (
                  <>
                    <Link
                      href={
                        user.userType === 'restaurant'
                          ? '/dashboard/restaurant'
                          : '/dashboard/lab'
                      }
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname.startsWith('/dashboard')
                          ? 'bg-ocean-800 text-white'
                          : 'text-ocean-100 hover:bg-ocean-600'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <span className="text-ocean-100 text-sm">
                      {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-md text-sm font-medium text-ocean-100 hover:bg-ocean-600 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/login')
                          ? 'bg-ocean-800 text-white'
                          : 'text-ocean-100 hover:bg-ocean-600'
                      }`}
                    >
                      Login
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
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
