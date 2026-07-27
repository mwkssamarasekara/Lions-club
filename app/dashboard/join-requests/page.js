'use client';

import { useState, useEffect } from 'react';
import { 
  getJoinRequests, 
  updateJoinRequestStatus, 
  deleteJoinRequest, 
  addMember, 
  formatDate 
} from '@/lib/firestore-db';

export default function JoinRequestsDashboard() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Detail Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getJoinRequests();
      setRequests(data);
      setFilteredRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Handle Filtering
  useEffect(() => {
    if (filter === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(r => r.status === filter));
    }
  }, [filter, requests]);

  const handleApprove = async (r) => {
    if (!confirm(`Approve "${r.fullName}" and add as member?`)) return;
    await updateJoinRequestStatus(r.id, 'approved');
    await addMember({ name: r.fullName, email: r.email, phone: r.phone, position: 'Member', photoURL: '' });
    loadData();
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this application?')) return;
    await updateJoinRequestStatus(id, 'rejected');
    loadData();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete application request from "${name}" permanently?`)) return;
    await deleteJoinRequest(id);
    loadData();
  };

  const handleViewDetails = (r) => {
    setActiveRequest(r);
    setIsOpen(true);
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ margin: 0 }}><i className="fa-solid fa-user-plus" style={{ color: 'var(--purple-600)' }}></i> Join Requests</h2>
      </div>

      <div className="toolbar">
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}><i className="fa-solid fa-clock"></i> Pending</button>
          <button className={`filter-tab ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}><i className="fa-solid fa-check"></i> Approved</button>
          <button className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}><i className="fa-solid fa-xmark"></i> Rejected</button>
        </div>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', margin: 0 }}>
          <span>{filteredRequests.length}</span> requests
        </p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                  <div className="spinner"></div>
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <i className="fa-solid fa-inbox"></i>
                    <p>No join requests found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.fullName}</strong></td>
                  <td>{r.email || '—'}</td>
                  <td>{r.phone || '—'}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.message}>{r.message || '—'}</td>
                  <td>{formatDate(r.submittedAt)}</td>
                  <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                  <td>
                    <div className="action-btns">
                      {r.status === 'pending' && (
                        <>
                          <button className="action-btn approve" onClick={() => handleApprove(r)} title="Approve"><i className="fa-solid fa-check"></i></button>
                          <button className="action-btn reject" onClick={() => handleReject(r.id)} title="Reject"><i className="fa-solid fa-xmark"></i></button>
                        </>
                      )}
                      {r.status === 'rejected' && (
                        <button className="action-btn delete" onClick={() => handleDelete(r.id, r.fullName)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                      )}
                      <button className="action-btn edit" onClick={() => handleViewDetails(r)} title="View"><i className="fa-solid fa-eye"></i></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isOpen && activeRequest && (
        <div className="modal-overlay active" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-file-lines" style={{ color: 'var(--purple-600)' }}></i> Request Details</h3>
              <button className="modal-close" onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>FULL NAME</strong><p style={{ margin: '4px 0 0' }}>{activeRequest.fullName}</p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>EMAIL</strong><p style={{ margin: '4px 0 0' }}>{activeRequest.email}</p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>PHONE</strong><p style={{ margin: '4px 0 0' }}>{activeRequest.phone}</p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>ADDRESS</strong><p style={{ margin: '4px 0 0' }}>{activeRequest.address || '—'}</p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>MESSAGE</strong><p style={{ margin: '4px 0 0' }}>{activeRequest.message || '—'}</p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>STATUS</strong><p style={{ margin: '4px 0 0' }}><span className={`badge badge-${activeRequest.status}`}>{activeRequest.status}</span></p></div>
              <div><strong style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>SUBMITTED</strong><p style={{ margin: '4px 0 0' }}>{formatDate(activeRequest.submittedAt)}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
