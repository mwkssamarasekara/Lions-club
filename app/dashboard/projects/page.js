'use client';

import { useState, useEffect } from 'react';
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  formatDate
} from '@/lib/firestore-db';

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Upcoming');

  // Upload/Image State
  const [uploadMode, setUploadMode] = useState('file');
  const [imageURL, setImageURL] = useState('');
  const [selectedFileData, setSelectedFileData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getEvents();
      setProjects(data);
      setFilteredProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Handle Search and Filter
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    let temp = projects.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q)
    );

    if (filter !== 'all') {
      temp = temp.filter(p => p.status === filter);
    }

    setFilteredProjects(temp);
  }, [searchQuery, filter, projects]);

  const handleAddOpen = () => {
    setEditId('');
    setTitle('');
    setDescription('');
    setLocation('');
    setDate('');
    setStatus('Upcoming');
    setImageURL('');
    setSelectedFileData(null);
    setUploadMode('file');
    setIsOpen(true);
  };

  const handleEditOpen = (p) => {
    setEditId(p.id);
    setTitle(p.title || '');
    setDescription(p.description || '');
    setLocation(p.location || '');
    setStatus(p.status || 'Upcoming');
    setSelectedFileData(null);

    // Format date string for HTML input (YYYY-MM-DD)
    if (p.date) {
      const d = p.date.toDate ? p.date.toDate() : new Date(p.date);
      setDate(d.toISOString().split('T')[0]);
    } else {
      setDate('');
    }

    if (p.imageURL) {
      setUploadMode('url');
      setImageURL(p.imageURL);
    } else {
      setUploadMode('file');
      setImageURL('');
    }
    setIsOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete project "${title}"?`)) return;
    await deleteEvent(id);
    loadData();
  };

  const handleFileSelect = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedFileData(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    let finalImageURL = '';
    if (uploadMode === 'file' && selectedFileData) {
      finalImageURL = selectedFileData;
    } else if (uploadMode === 'url') {
      finalImageURL = imageURL;
    }

    const data = {
      title,
      description,
      location,
      date,
      status,
      imageURL: finalImageURL
    };

    try {
      if (editId) {
        await updateEvent(editId, data);
      } else {
        await addEvent(data);
      }
      setIsOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Card summary numbers
  const upcomingCount = projects.filter(p => p.status === 'Upcoming').length;
  const ongoingCount = projects.filter(p => p.status === 'Ongoing').length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ margin: 0 }}><i className="fa-solid fa-diagram-project" style={{ color: 'var(--purple-600)' }}></i> Projects</h2>
        <button className="btn btn-sm btn-primary" onClick={handleAddOpen}><i className="fa-solid fa-plus"></i> Add Project</button>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="summary-card blue">
          <div className="summary-card-icon"><i className="fa-solid fa-folder-open"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : projects.length}</h3>
            <p>Total Projects</p>
          </div>
        </div>
        <div className="summary-card gold">
          <div className="summary-card-icon"><i className="fa-solid fa-clock"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : upcomingCount}</h3>
            <p>Upcoming</p>
          </div>
        </div>
        <div className="summary-card purple">
          <div className="summary-card-icon"><i className="fa-solid fa-spinner"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : ongoingCount}</h3>
            <p>Ongoing</p>
          </div>
        </div>
        <div className="summary-card green">
          <div className="summary-card-icon"><i className="fa-solid fa-check-double"></i></div>
          <div className="summary-card-info">
            <h3>{loading ? '—' : completedCount}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-tab ${filter === 'Upcoming' ? 'active' : ''}`} onClick={() => setFilter('Upcoming')}><i className="fa-solid fa-clock"></i> Upcoming</button>
          <button className={`filter-tab ${filter === 'Ongoing' ? 'active' : ''}`} onClick={() => setFilter('Ongoing')}><i className="fa-solid fa-spinner"></i> Ongoing</button>
          <button className={`filter-tab ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}><i className="fa-solid fa-check"></i> Completed</button>
        </div>
        <div className="search-bar">
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Location</th>
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
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="empty-state">
                    <i className="fa-solid fa-folder-open"></i>
                    <p>No projects found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProjects.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.imageURL ? (
                      <img src={p.imageURL} alt={p.title} style={{ width: '60px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '60px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', fontSize: '0.8rem' }}>
                        <i className="fa-solid fa-image"></i>
                      </div>
                    )}
                  </td>
                  <td><strong>{p.title}</strong></td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.description}>{p.description || '—'}</td>
                  <td>{formatDate(p.date)}</td>
                  <td>{p.location || '—'}</td>
                  <td>
                    <span className={`badge badge-${(p.status || 'Upcoming').toLowerCase()}`}>
                      {p.status || 'Upcoming'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => handleEditOpen(p)} title="Edit"><i className="fa-solid fa-pen"></i></button>
                      <button className="action-btn delete" onClick={() => handleDelete(p.id, p.title)} title="Delete"><i className="fa-solid fa-trash"></i></button>
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
                <i className={`fa-solid ${editId ? 'fa-pen' : 'fa-plus'}`} style={{ color: 'var(--purple-600)' }}></i>
                {editId ? ' Edit Project' : ' Add Project'}
              </h3>
              <button className="modal-close" onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label><i className="fa-solid fa-heading"></i> Project Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="form-group">
                <label><i className="fa-solid fa-align-left"></i> Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project description..."
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label><i className="fa-solid fa-location-dot"></i> Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Homagama Hospital"
                  required
                />
              </div>
              <div className="form-group">
                <label><i className="fa-solid fa-calendar"></i> Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label><i className="fa-solid fa-tag"></i> Status</label>
                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
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
                  <i className="fa-solid fa-link"></i> Image URL
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
                    <p className="upload-zone-hint">PNG, JPG, WEBP up to 10MB</p>
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
                      value={imageURL}
                      onChange={(e) => setImageURL(e.target.value)}
                      placeholder="https://example.com/project.jpg"
                    />
                  </div>
                  {imageURL && (
                    <div style={{ marginBottom: 'var(--space-lg)', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '180px' }}>
                      <img src={imageURL} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
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
                    <i className="fa-solid fa-save"></i> Save Project
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
