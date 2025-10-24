'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUser, logout } from '@/lib/auth';
import { User } from '@/lib/types';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      window.location.href = '/auth/sign-in';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <nav className="bg-base-100 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold">Fullstack App</Link>
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-base-100 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">Fullstack App</Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.name}</span>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full bg-neutral text-neutral-content">
                      <span>{user.name.charAt(0)}</span>
                    </div>
                  </div>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                    <li><Link href="/posts">My Posts</Link></li>
                    <li><a onClick={handleLogout} className="cursor-pointer">Logout</a></li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" className="btn btn-ghost">Sign In</Link>
                <Link href="/auth/sign-up" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}