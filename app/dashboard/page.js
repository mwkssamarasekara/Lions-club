'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  getCollectionCount, 
  getJoinRequests, 
  getDonations, 
  formatDate, 
  formatCurrency 
} from '@/lib/firestore-db';

export default function Dashboard() {
  const [counts, setCounts] = useState({ members: 0, pendingRequests: 0, totalDonations: 0, galleryCount: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [members, pending, donationsCount, gallery] = await Promise.all([
          getCollectionCount('members'),
          getCollectionCount('joinRequests', 'status', 'pending'),
          getCollectionCount('donations'),
          getCollectionCount('gallery')
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
