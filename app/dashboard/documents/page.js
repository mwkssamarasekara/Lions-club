'use client';

import { useState, useEffect } from 'react';
import { getProjectDocuments, addProjectDocument, deleteProjectDocument, getEvents, formatDate } from '@/lib/firestore-db';

export default function DocumentsDashboard() {
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [uploadMode, setUploadMode] = useState('file');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [docData, projData] = await Promise.all([
        getProjectDocuments(),
        getEvents()
      ]);
      setDocuments(docData);
      setProjects(projData);
      if (projData.length > 0) setProjectTitle(projData[0].title);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAddOpen = () => {
    setTitle('');
    setDescription('');
    setPdfUrl('');
    setPdfFile(null);
    setFileName('');
    setUploadMode('file');
    if (projects.length > 0) setProjectTitle(projects[0].title);
    setIsOpen(true);
  };

  const handleFileSelect = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF document.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size limit is 10MB.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPdfFile(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id, docTitle) => {
    if (!confirm(`Delete project document "${docTitle}"?`)) return;
    await deleteProjectDocument(id);
    loadData();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    let finalPdfUrl = '';
    if (uploadMode === 'file') {
      if (!pdfFile) {
        alert('Please choose a PDF file to upload.');
        return;
      }
      finalPdfUrl = pdfFile;
    } else {
      if (!pdfUrl) {
        alert('Please enter a valid PDF URL.');
        return;
      }
      finalPdfUrl = pdfUrl;
    }

    setSaving(true);
    try {
      await addProjectDocument({
        title,
        description,
        projectTitle,
        pdfUrl: finalPdfUrl,
        fileName: fileName || title + '.pdf'
      });
      setIsOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ margin: 0 }}><i className="fa-solid fa-file-pdf" style={{ color: 'var(--danger)' }}></i> Project PDF Documents</h2>
        <button className="btn btn-sm btn-primary" onClick={handleAddOpen}><i className="fa-solid fa-plus"></i> Add Document</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Project</th>
              <th>Description</th>
              <th>Date Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                  <div className="spinner"></div>
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <i className="fa-solid fa-file-excel"></i>
                    <p>No project documents found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fa-solid fa-file-pdf" style={{ color: 'var(--danger)', fontSize: '1.4rem' }}></i>
                      <div>
                        <strong>{doc.title}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{doc.fileName || 'document.pdf'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-upcoming">{doc.projectTitle || 'General'}</span>
                  </td>
                  <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.description}>
                    {doc.description || '—'}
                  </td>
                  <td>{formatDate(doc.uploadedAt)}</td>
                  <td>
                    <div className="action-btns">
                      <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn edit" title="View PDF">
                        <i className="fa-solid fa-eye"></i>
                      </a>
                      <button className="action-btn delete" onClick={() => handleDelete(doc.id, doc.title)} title="Delete">
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Document Modal */}
      {isOpen && (
        <div className="modal-overlay active" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-file-pdf" style={{ color: 'var(--danger)' }}></i> Add Project PDF Document</h3>
              <button className="modal-close" onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label><i className="fa-solid fa-heading"></i> Document Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Health Camp Audit & Impact Report 2025"
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-diagram-project"></i> Associated Project</label>
                <select
                  className="form-control"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                >
                  <option value="General Community Report">General Community Report</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-align-left"></i> Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of document content..."
                  rows="3"
                ></textarea>
              </div>

              {/* Upload Mode Tabs */}
              <div className="upload-tabs">
                <button
                  type="button"
                  className={`upload-tab ${uploadMode === 'file' ? 'active' : ''}`}
                  onClick={() => setUploadMode('file')}
                >
                  <i className="fa-solid fa-cloud-arrow-up"></i> Upload PDF File
                </button>
                <button
                  type="button"
                  className={`upload-tab ${uploadMode === 'url' ? 'active' : ''}`}
                  onClick={() => setUploadMode('url')}
                >
                  <i className="fa-solid fa-link"></i> PDF Web Link
                </button>
              </div>

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
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                    <div className="upload-zone-icon" style={{ color: 'var(--danger)' }}><i className="fa-solid fa-file-pdf"></i></div>
                    <p className="upload-zone-text"><strong>Click to select PDF</strong> or drag & drop</p>
                    <p className="upload-zone-hint">PDF documents up to 10MB</p>
                  </div>
                  {fileName && (
                    <div style={{ padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-md)' }}>
                      <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-700)' }}>{fileName}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label><i className="fa-solid fa-link"></i> PDF Document Direct URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://example.com/report.pdf"
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-md)' }} disabled={saving}>
                {saving ? (
                  <>
                    <div className="spinner" style={{ width: '18px', height: '18px', margin: 0, borderWidth: '2px' }}></div> Saving...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i> Save PDF Document
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
