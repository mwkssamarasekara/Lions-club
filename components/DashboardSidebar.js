'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      await logoutUser();
      router.push('/dashboard/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'fa-gauge-high' },
    { label: 'Festival Sessions', href: '/dashboard/festivals', icon: 'fa-wand-magic-sparkles' },
    { label: 'Members', href: '/dashboard/members', icon: 'fa-users' },
    { label: 'Projects', href: '/dashboard/projects', icon: 'fa-diagram-project' },
    { label: 'Project PDFs', href: '/dashboard/documents', icon: 'fa-file-pdf' },
    { label: 'Short Videos', href: '/dashboard/short-videos', icon: 'fa-video' },
    { label: 'Join Requests', href: '/dashboard/join-requests', icon: 'fa-user-plus' },
    { label: 'Donations', href: '/dashboard/donations', icon: 'fa-hand-holding-dollar' },
    { label: 'Gallery', href: '/dashboard/gallery', icon: 'fa-images' }
  ];

  return (
    <>
      {/* Mobile topbar toggle button */}
      <button 
        className="sidebar-toggle" 
        id="sidebarToggle" 
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Navigation Sidebar"
      >
        <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-brand">
          <img src="/assets/img/logo.png" alt="Lions Club of Homagama Diamonds" />
          <span style={{ fontSize: '0.85rem', lineHeight: '1.2' }}>Lions Club of Homagama Diamonds</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={isActive ? 'active' : ''}
                onClick={() => setMobileOpen(false)}
              >
                <i className={`fa-solid ${item.icon}`}></i> {item.label}
              </Link>
            );
          })}
          <div className="nav-divider"></div>
          <Link href="/"><i className="fa-solid fa-globe"></i> View Website</Link>
          <a href="#" onClick={handleLogout} style={{ color: 'rgba(239,68,68,0.8)' }}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </a>
        </nav>
      </aside>
    </>
  );
}
