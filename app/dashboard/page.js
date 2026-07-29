'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  getCollectionCount, 
  getJoinRequests, 
  getDonations, 
  formatDate, 
  formatCurrency,
  getSettings
} from '@/lib/firestore-db';

export default function Dashboard() {
  const [counts, setCounts] = useState({ members: 0, pendingRequests: 0, totalDonations: 0, galleryCount: 0 });
  const [analytics, setAnalytics] = useState({ viewsCount: 0, pageViews: {} });
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [members, pending, donationsCount, gallery, settingsData] = await Promise.all([
          getCollectionCount('members'),
          getCollectionCount('joinRequests', 'status', 'pending'),
          getCollectionCount('donations'),
          getCollectionCount('gallery'),
          getSettings()
        ]);

        const [requests, donations] = await Promise.all([
          getJoinRequests(),
          getDonations()
        ]);

        setCounts({
          members,
          pendingRequests: pending,
          totalDonations: donationsCount,
          galleryCount: gallery
        });

        if (settingsData) {
          setAnalytics({
            viewsCount: settingsData.viewsCount || 0,
            pageViews: settingsData.pageViews || {}
          });
        }

        setRecentRequests(requests.slice(0, 5));
        setRecentDonations(donations.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="dashboard-content">
      {/* Summary Row */}
      <div className="summary-grid">
        <div className="summary-card blue">
          <div className="summary-card-icon"><i className="fa-solid fa-users"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : counts.members}</h3>
            <p>Total Members</p>
          </div>
        </div>
        <div className="summary-card gold">
          <div className="summary-card-icon"><i className="fa-solid fa-user-clock"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : counts.pendingRequests}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="summary-card green">
          <div className="summary-card-icon"><i className="fa-solid fa-hand-holding-dollar"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : counts.totalDonations}</h3>
            <p>Total Donations</p>
          </div>
        </div>
        <div className="summary-card purple">
          <div className="summary-card-icon"><i className="fa-solid fa-images"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : counts.galleryCount}</h3>
            <p>Gallery Images</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-xl)', marginTop: 'var(--space-xl)' }}>
        <h3 style={{ marginBottom: 'var(--space-lg)' }}><i className="fa-solid fa-bolt" style={{ color: 'var(--yellow-500)' }}></i> Quick Actions</h3>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Link href="/dashboard/members" className="btn btn-sm btn-blue"><i className="fa-solid fa-user-plus"></i> Add Member</Link>
          <Link href="/dashboard/join-requests" className="btn btn-sm btn-purple"><i className="fa-solid fa-clipboard-check"></i> Review Requests</Link>
          <Link href="/dashboard/donations" className="btn btn-sm btn-primary"><i className="fa-solid fa-chart-line"></i> View Donations</Link>
          <Link href="/dashboard/gallery" className="btn btn-sm btn-outline"><i className="fa-solid fa-upload"></i> Upload Photo</Link>
        </div>
      </div>

      {/* Website Analytics */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ marginBottom: 'var(--space-lg)' }}><i className="fa-solid fa-chart-simple" style={{ color: 'var(--blue-600)' }}></i> Website Analytics</h3>
        
        <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="summary-card blue" style={{ boxShadow: 'none', border: '1px solid var(--gray-100)', margin: 0 }}>
            <div className="summary-card-icon"><i className="fa-solid fa-eye"></i></div>
            <div className="summary-card-info">
              <h3>{loading ? '—' : analytics.viewsCount}</h3>
              <p>Total Views / Visits</p>
            </div>
          </div>
          <div className="summary-card purple" style={{ boxShadow: 'none', border: '1px solid var(--gray-100)', margin: 0 }}>
            <div className="summary-card-icon"><i className="fa-solid fa-file-lines"></i></div>
            <div className="summary-card-info">
              <h3>7</h3>
              <p>Total Website Pages</p>
            </div>
          </div>
        </div>

        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: 'var(--space-md)' }}>Page-wise Views Breakdown</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {[
            { label: 'Home Page (/)', key: 'home', icon: 'fa-house' },
            { label: 'About Us Page (/about)', key: 'about', icon: 'fa-circle-info' },
            { label: 'Projects Page (/projects)', key: 'projects', icon: 'fa-diagram-project' },
            { label: 'Media Gallery Page (/gallery)', key: 'gallery', icon: 'fa-images' },
            { label: 'Contact Us Page (/contact)', key: 'contact', icon: 'fa-envelope' },
            { label: 'Donate Page (/donate)', key: 'donate', icon: 'fa-heart' },
            { label: 'Join Us Form (/join)', key: 'join', icon: 'fa-user-plus' }
          ].map(page => {
            const val = analytics.pageViews[page.key] || 0;
            const pct = analytics.viewsCount > 0 ? Math.round((val / analytics.viewsCount) * 100) : 0;
            return (
              <div key={page.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500 }}>
                  <span style={{ color: 'var(--gray-800)' }}><i className={`fa-solid ${page.icon}`} style={{ marginRight: '8px', color: 'var(--gray-400)', width: '16px' }}></i> {page.label}</span>
                  <span style={{ color: 'var(--gray-500)' }}><strong>{val}</strong> views ({pct}%)</span>
                </div>
                <div style={{ height: '8px', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gradient-blue)', borderRadius: 'var(--radius-full)', transition: 'width 1s ease' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid-2">
        {/* Recent Join Requests */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span><i className="fa-solid fa-user-plus" style={{ color: 'var(--purple-600)' }}></i> Recent Requests</span>
            <Link href="/dashboard/join-requests" style={{ fontSize: '0.8rem', color: 'var(--blue-600)' }}>View All →</Link>
          </h3>
          <div id="recentRequests">
            {loading ? (
              <div className="spinner"></div>
            ) : recentRequests.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', textAlign: 'center' }}>No join requests yet.</p>
            ) : (
              recentRequests.map(r => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-100)' }} key={r.id}>
                  <div>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{r.fullName}</p>
                    <p style={{ color: 'var(--gray-400)', margin: 0, fontSize: '0.8rem' }}>{formatDate(r.submittedAt)}</p>
                  </div>
                  <span className={`badge badge-${r.status}`}>{r.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Donations */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span><i className="fa-solid fa-hand-holding-dollar" style={{ color: 'var(--success)' }}></i> Recent Donations</span>
            <Link href="/dashboard/donations" style={{ fontSize: '0.8rem', color: 'var(--blue-600)' }}>View All →</Link>
          </h3>
          <div id="recentDonations">
            {loading ? (
              <div className="spinner"></div>
            ) : recentDonations.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', textAlign: 'center' }}>No donations yet.</p>
            ) : (
              recentDonations.map(d => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--gray-100)' }} key={d.id}>
                  <div>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{d.fullName}</p>
                    <p style={{ color: 'var(--gray-400)', margin: 0, fontSize: '0.8rem' }}>{d.purpose} · {formatDate(d.submittedAt)}</p>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(d.amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
