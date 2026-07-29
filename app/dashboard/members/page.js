'use client';

import { useState, useEffect } from 'react';
import { 
  getMembers, 
  addMember, 
  updateMember, 
  deleteMember, 
  formatDate 
} from '@/lib/firestore-db';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function MembersDashboard() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('Member');

  // Upload state
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [photoURL, setPhotoURL] = useState('');
  const [selectedFileData, setSelectedFileData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data);
      setFilteredMembers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Handle Search
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredMembers(
      members.filter(m => 
        (m.name || '').toLowerCase().includes(q) ||
        (m.position || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q)
      )
    );
  }, [searchQuery, members]);

  // Open Modal for Add
  const handleAddOpen = () => {
    setEditId('');
    setName('');
    setEmail('');
    setPhone('');
    setPosition('Member');
    setPhotoURL('');
    setSelectedFileData(null);
    setUploadMode('file');
    setIsOpen(true);
  };

  // Open Modal for Edit
  const handleEditOpen = (m) => {
    setEditId(m.id);
    setName(m.name || '');
    setEmail(m.email || '');
    setPhone(m.phone || '');
    setPosition(m.position || 'Member');
    setSelectedFileData(null);

    if (m.photoURL) {
      setUploadMode('url');
      setPhotoURL(m.photoURL);
    } else {
      setUploadMode('file');
      setPhotoURL('');
    }
    setIsOpen(true);
  };

  // Delete Member
  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}" from members?`)) return;
    await deleteMember(id);
    loadData();
  };

  // File select
  const handleFileSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedFileData(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Save member
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    let finalPhotoURL = '';
    if (uploadMode === 'file' && selectedFileData) {
      finalPhotoURL = selectedFileData;
    } else if (uploadMode === 'url') {
      finalPhotoURL = photoURL;
    }

    const data = {
      name,
      email,
      phone,
      position,
      photoURL: finalPhotoURL
    };

    try {
      if (editId) {
        await updateMember(editId, data);
      } else {
        await addMember(data);
      }
      setIsOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // PDF Report export
  const downloadPdf = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(15, 35, 71); // Navy blue
    doc.text("LIONS CLUB OF HOMAGAMA DIAMONDS", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 110, 120);
    doc.text("Official Club Members Directory", 14, 27);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-LK')} | Total Members: ${members.length}`, 14, 33);

    const tableHeaders = [["Name", "Email", "Phone", "Position", "Joined Date"]];
    const tableRows = members.map(m => [
      m.name || '—',
      m.email || '—',
      m.phone || '—',
      m.position || 'Member',
      formatDate(m.joinedDate)
    ]);

    autoTable(doc, {
      startY: 38,
      head: tableHeaders,
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [15, 35, 71], textContrast: 1 },
      styles: { font: "helvetica", fontSize: 9 },
      margin: { top: 35 }
    });

    doc.save(`Lions_Homagama_Members_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ margin: 0 }}><i className="fa-solid fa-users" style={{ color: 'var(--blue-600)' }}></i> Members</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-sm btn-outline" onClick={downloadPdf}><i className="fa-solid fa-file-pdf"></i> Download PDF</button>
          <button className="btn btn-sm btn-primary" onClick={handleAddOpen}><i className="fa-solid fa-plus"></i> Add Member</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <i className="fa-solid fa-search"></i>
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', margin: 0 }}>
          <span>{filteredMembers.length}</span> members
        </p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Joined Date</th>
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
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <i className="fa-solid fa-users"></i>
                    <p>No members found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMembers.map(m => (
                <tr key={m.id}>
                  <td>
                    {m.photoURL ? (
                      <img src={m.photoURL} alt={m.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)' }}>
                        <i className="fa-solid fa-user"></i>
                      </div>
                    )}
                  </td>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.email || '—'}</td>
                  <td>{m.phone || '—'}</td>
                  <td><span className="badge badge-upcoming">{m.position || 'Member'}</span></td>
                  <td>{formatDate(m.joinedDate)}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => handleEditOpen(m)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                      <button className="action-btn delete" onClick={() => handleDelete(m.id, m.name)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="modal-overlay active" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className={`fa-solid ${editId ? 'fa-pen' : 'fa-plus'}`} style={{ color: 'var(--blue-600)' }}></i> 
                {editId ? ' Edit Member' : ' Add Member'}
              </h3>
              <button className="modal-close" onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label><i className="fa-solid fa-user"></i> Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-solid fa-envelope"></i> Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com" 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-solid fa-phone"></i> Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 7X XXX XXXX" 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-solid fa-briefcase"></i> Position / Role</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Type or select a position..." 
                  list="positions-list"
                  required 
                />
                <datalist id="positions-list">
                  <option value="Member" />
                  <option value="President" />
                  <option value="Secretary" />
                  <option value="Treasurer" />
                  <option value="Vice President" />
                  <option value="Director" />
                  <option value="Coordinator" />
                  <option value="Social Administrator" />
                  <option value="Chief Coordinator" />
                </datalist>
              </div>

              {/* Upload Tabs */}
              <div className="upload-tabs">
                <button 
                  type="button" 
                  className={`upload-tab ${uploadMode === 'file' ? 'active' : ''}`}
                  onClick={() => setUploadMode('file')}
                >
                  <i className="fa-solid fa-computer"></i> Upload File
                </button>
                <button 
                  type="button" 
                  className={`upload-tab ${uploadMode === 'url' ? 'active' : ''}`}
                  onClick={() => setUploadMode('url')}
                >
                  <i className="fa-solid fa-link"></i> Photo URL
                </button>
              </div>

              {/* File Upload zone */}
              {uploadMode === 'file' ? (
                <div>
                  <div 
                    className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileSelect(file);
                    }}
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                    <div className="upload-zone-icon"><i className="fa-solid fa-cloud-arrow-up"></i></div>
                    <p className="upload-zone-text"><strong>Click to choose</strong> or drag & drop</p>
                    <p className="upload-zone-hint">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  {selectedFileData && (
                    <div className="upload-preview" style={{ display: 'block' }}>
                      <img src={selectedFileData} alt="Preview" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label><i className="fa-solid fa-link"></i> Image URL</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://example.com/photo.jpg" 
                    />
                  </div>
                  {photoURL && (
                    <div style={{ marginBottom: 'var(--space-lg)', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '180px' }}>
                      <img src={photoURL} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-lg)' }} disabled={saving}>
                {saving ? (
                  <>
                    <div className="spinner" style={{ width: '18px', height: '18px', margin: 0, borderWidth: '2px' }}></div> Saving...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i> Save Member
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
