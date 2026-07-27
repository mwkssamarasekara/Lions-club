'use client';

import { useState, useEffect } from 'react';
import { 
  getDonations, 
  updateDonationStatus, 
  formatDate, 
  formatCurrency 
} from '@/lib/firestore-db';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function DonationsDashboard() {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getDonations();
      setDonations(data);
      setFilteredDonations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Handle Search & Filter
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    let temp = donations.filter(d => 
      (d.fullName || '').toLowerCase().includes(q) ||
      (d.email || '').toLowerCase().includes(q) ||
      (d.purpose || '').toLowerCase().includes(q)
    );

    if (filter !== 'all') {
      temp = temp.filter(d => d.status === filter);
    }

    setFilteredDonations(temp);
  }, [searchQuery, filter, donations]);

  const handleMarkPaid = async (id) => {
    if (!confirm('Mark this donation as paid?')) return;
    await updateDonationStatus(id, 'paid');
    loadData();
  };

  const handleViewSlip = (d) => {
    if (!d.slipData) {
      alert('No slip data found for this donation.');
      return;
    }
    
    const newTab = window.open();
    if (!newTab) {
      alert('Popup blocked. Please allow popups for this dashboard.');
      return;
    }

    if (d.slipData.startsWith('data:application/pdf')) {
      newTab.document.write(`
        <html>
          <head><title>Bank Slip - PDF</title></head>
          <body style="margin:0;">
            <iframe src="${d.slipData}" style="border:0; width:100%; height:100vh;"></iframe>
          </body>
        </html>
      `);
    } else {
      newTab.document.write(`
        <html>
          <head><title>Bank Slip - Image</title></head>
          <body style="margin:0; background:#0b1120; display:flex; align-items:center; justify-content:center; min-height:100vh;">
            <img src="${d.slipData}" style="max-width:95%; max-height:95vh; object-fit:contain; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          </body>
        </html>
      `);
    }
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(15, 35, 71); // Navy blue
    doc.text("LIONS CLUB OF HOMAGAMA DIAMONDS", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 110, 120);
    doc.text("Donation Logs & Contributions Report", 14, 27);
    
    const totalAmountVal = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-LK')} | Total Count: ${donations.length} | Total Amount: ${formatCurrency(totalAmountVal)}`, 14, 33);

    const tableHeaders = [["Donor Name", "Email", "Amount", "Purpose", "Method", "Date", "Status"]];
    const tableRows = donations.map(d => [
      d.fullName || '—',
      d.email || '—',
      formatCurrency(d.amount || 0),
      d.purpose || '—',
      d.paymentMethod || '—',
      formatDate(d.submittedAt),
      d.status || 'pending'
    ]);

    doc.autoTable({
      startY: 38,
      head: tableHeaders,
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [15, 35, 71], textContrast: 1 },
      styles: { font: "helvetica", fontSize: 9 },
      margin: { top: 35 }
    });

    doc.save(`Lions_Homagama_Donations_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Summaries
  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const pendingCount = donations.filter(d => d.status === 'pending').length;
  const paidCount = donations.filter(d => d.status === 'paid').length;

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ margin: 0 }}><i className="fa-solid fa-hand-holding-dollar" style={{ color: 'var(--success)' }}></i> Donations</h2>
        <button className="btn btn-sm btn-outline" onClick={downloadPdf}><i className="fa-solid fa-file-pdf"></i> Download PDF</button>
      </div>

      {/* Summary Row */}
      <div className="summary-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="summary-card green">
          <div className="summary-card-icon"><i className="fa-solid fa-coins"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : formatCurrency(totalAmount)}</h3>
            <p>Total Amount</p>
          </div>
        </div>
        <div className="summary-card blue">
          <div className="summary-card-icon"><i className="fa-solid fa-receipt"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : donations.length}</h3>
            <p>Total Donations</p>
          </div>
        </div>
        <div className="summary-card gold">
          <div className="summary-card-icon"><i className="fa-solid fa-clock"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : pendingCount}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="summary-card purple">
          <div className="summary-card-icon"><i className="fa-solid fa-check-double"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : paidCount}</h3>
            <p>Paid</p>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}><i className="fa-solid fa-clock"></i> Pending</button>
          <button className={`filter-tab ${filter === 'paid' ? 'active' : ''}`} onClick={() => setFilter('paid')}><i className="fa-solid fa-check"></i> Paid</button>
        </div>
        <div className="search-bar">
          <i className="fa-solid fa-search"></i>
          <input 
            type="text" 
            placeholder="Search donations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Purpose</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                  <div className="spinner"></div>
                </td>
              </tr>
            ) : filteredDonations.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="empty-state">
                    <i className="fa-solid fa-hand-holding-dollar"></i>
                    <p>No donations found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDonations.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.fullName}</strong></td>
                  <td>{d.email || '—'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(d.amount || 0)}</td>
                  <td>{d.purpose || '—'}</td>
                  <td><span className="badge badge-upcoming">{d.paymentMethod || '—'}</span></td>
                  <td>{formatDate(d.submittedAt)}</td>
                  <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                  <td>
                    <div className="action-btns">
                      {d.slipData && (
                        <button className="action-btn edit" onClick={() => handleViewSlip(d)} title="View Slip"><i className="fa-solid fa-receipt"></i></button>
                      )}
                      {d.status === 'pending' && (
                        <button className="action-btn approve" onClick={() => handleMarkPaid(d.id)} title="Mark as Paid"><i className="fa-solid fa-check"></i></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
