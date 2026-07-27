'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser, onAuthStateChanged } from '@/lib/auth';
import { showToast } from '@/lib/firestore-db';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await loginUser(email, password);
    if (res.success) {
      showToast('Logged in successfully!', 'success');
      router.push('/dashboard');
    } else {
      showToast(res.message || 'Login failed.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/assets/img/logo.png" alt="Lions Logo" />
        <h2>Admin Login</h2>
        <p>Lions Diamond Homagama</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><i className="fa-solid fa-envelope"></i> Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="admin@lions.lk" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
            <label><i className="fa-solid fa-lock"></i> Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: '18px', height: '18px', margin: 0, borderWidth: '2px' }}></div> Logging in...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket"></i> Login
              </>
            )}
          </button>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
            <Link href="/" style={{ color: 'var(--blue-600)', fontSize: '0.9rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', textDecoration: 'none' }}>
              <i className="fa-solid fa-arrow-left"></i> Visit Website
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
