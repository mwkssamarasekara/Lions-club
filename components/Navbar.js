'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { incrementViewCount } from '@/lib/firestore-db';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle theme load & changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('lions-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Track page views
  useEffect(() => {
    if (pathname && !pathname.startsWith('/dashboard')) {
      incrementViewCount(pathname);
    }
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('lions-theme', nextTheme);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <nav className={`navbar ${scrolled || mobileOpen ? 'scrolled' : ''}`}>
      <div className="container">
        <Link href="/" className="navbar-brand">
          <img src="/assets/img/logo.png" alt="Logo" />
          <span>Lions Diamonds</span>
        </Link>
        
        <div className={`nav-links ${mobileOpen ? 'open' : ''}`} id="navLinks">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={isActive ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Link 
            href="/donate" 
            className={`nav-cta ${pathname === '/donate' ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <i className="fa-solid fa-heart"></i> Donate
          </Link>
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" id="themeToggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            <i className="fa-solid fa-sun"></i>
            <i className="fa-solid fa-moon"></i>
          </button>
          <Link href="/dashboard" className="nav-profile" aria-label="Login / Profile">
            <i className="fa-solid fa-user"></i>
          </Link>
        </div>

        <div 
          className={`nav-toggle ${mobileOpen ? 'active' : ''}`} 
          id="navToggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
