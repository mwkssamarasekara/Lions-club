'use client';

import { useState, useEffect } from 'react';
import { 
  getGalleryImages, 
  addGalleryImage, 
  deleteGalleryImage 
} from '@/lib/firestore-db';

export default function GalleryDashboard() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Service');
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
      const data = await getGalleryImages();
      setImages(data);
      setFilteredImages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Handle Search & Filter
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    let temp = images.filter(img => 
      (img.title || '').toLowerCase().includes(q) ||
      (img.category || '').toLowerCase().includes(q)
    );

    if (filter !== 'All') {
      temp = temp.filter(img => img.category === filter);
    }

    setFilteredImages(temp);
  }, [searchQuery, filter, images]);

  const handleAddOpen = () => {
    setTitle('');
    setCategory('Service');
    setImageURL('');
    setSelectedFileData(null);
    setUploadMode('file');
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this image from gallery permanently?')) return;
    await deleteGalleryImage(id);
    loadData();
  };

  const handleFileSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum 5MB.');
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

    if (!finalImageURL) {
      alert('Please select a file or enter an image URL.');
      setSaving(false);
      return;
    }

    const data = {
      title,
      category,
      imageURL: finalImageURL
    };

    try {
      await addGalleryImage(data);
      setIsOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const categories = ['All', 'Service', 'Education', 'Health', 'Donations', 'Meetings'];

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ margin: 0 }}><i className="fa-solid fa-images" style={{ color: 'var(--blue-600)' }}></i> Gallery</h2>
        <button className="btn btn-sm btn-primary" onClick={handleAddOpen}><i className="fa-solid fa-plus"></i> Upload Image</button>
      </div>

      <div className="toolbar">
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-tab ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="search-bar">
          <i className="fa-solid fa-search"></i>
          <input 
            type="text" 
            placeholder="Search gallery..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-4xl)' }}>
          <div className="spinner"></div>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-images"></i>
          <p>No gallery images found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
          {filteredImages.map(img => (
            <div 
              key={img.id}
              className="dash-gallery-item"
              style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                height: '180px'
              }}
            >
              <img src={img.imageURL} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 'var(--space-md)',
                  color: 'white'
                }}
              >
                <h4 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.title || 'Untitled'}</h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{img.category}</p>
                <button 
                  onClick={() => handleDelete(img.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                  title="Delete Image"
                >
                  <i className="fa-solid fa-trash" style={{ fontSize: '0.8rem' }}></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div className="modal-overlay active" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-image" style={{ color: 'var(--blue-600)' }}></i> Upload Image</h3>
              <button className="modal-close" onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label><i className="fa-solid fa-heading"></i> Image Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter image title" 
                  required 
                />
              </div>
              <div className="form-group">
                <label><i className="fa-solid fa-tag"></i> Category</label>
                <select 
                  className="form-control" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="Service">Service</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Donations">Donations</option>
                  <option value="Meetings">Meetings</option>
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
                      value={imageURL}
                      onChange={(e) => setImageURL(e.target.value)}
                      placeholder="https://example.com/photo.jpg" 
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
                    <div className="spinner" style={{ width: '18px', height: '18px', margin: 0, borderWidth: '2px' }}></div> Uploading...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-upload"></i> Upload Image
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
