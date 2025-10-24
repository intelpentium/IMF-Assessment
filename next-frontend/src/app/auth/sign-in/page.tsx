'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(email, password);
      // Redirect to posts page after successful sign in
      router.push('/posts');
      router.refresh();
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-[70vh]">
      <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold text-center">Sign In</h1>
          
          {error && <Alert message={error} type="error" />}
          
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn ${loading ? 'btn-disabled' : 'btn-primary'}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p>
              Don't have an account?{' '}
              <Link href="/auth/sign-up" className="link link-primary">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}