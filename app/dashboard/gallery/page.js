'use client';

import { useState, useEffect } from 'react';
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  getGalleryCategories,
  addGalleryCategory,
  deleteGalleryCategory
} from '@/lib/firestore-db';

export default function GalleryDashboard() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Upload Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Service');
  const [uploadMode, setUploadMode] = useState('file');
  const [imageURL, setImageURL] = useState('');
  const [selectedFileData, setSelectedFileData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);

  // Manage Categories Modal State
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [catSaving, setCatSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [imagesData, categoriesData] = await Promise.all([
        getGalleryImages(),
        getGalleryCategories()
      ]);
      setImages(imagesData);
      setFilteredImages(imagesData);
      setCategories(categoriesData);

      if (categoriesData.length > 0) {
        setCategory(categoriesData[0].name);
      }
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
    if (categories.length > 0) {
      setCategory(categories[0].name);
    } else {
      setCategory('Service');
    }
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatSaving(true);
    try {
      const added = await addGalleryCategory(newCatName.trim());
      if (added) {
        setCategories([...categories, added]);
        setNewCatName('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!confirm(`Delete category "${name}"? Images tagged under this category will not be deleted but won't be filtered by it.`)) return;
    try {
      const success = await deleteGalleryCategory(id);
      if (success) {
        setCategories(categories.filter(c => c.id !== id));
        if (filter === name) {
          setFilter('All');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filterTabs = ['All', ...categories.map(c => c.name)];

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ margin: 0 }}><i className="fa-solid fa-images" style={{ color: 'var(--blue-600)' }}></i> Gallery</h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button className="btn btn-sm btn-outline" onClick={() => setIsCatOpen(true)}><i className="fa-solid fa-tags"></i> Manage Categories</button>
          <button className="btn btn-sm btn-primary" onClick={handleAddOpen}><i className="fa-solid fa-plus"></i> Upload Image</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-tabs" style={{ marginBottom: 0 }}>
          {filterTabs.map(cat => (
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

      {/* Upload Modal */}
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
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
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

      {/* Category Management Modal */}
      {isCatOpen && (
        <div className="modal-overlay active" onClick={() => setIsCatOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-tags" style={{ color: 'var(--blue-600)' }}></i> Manage Categories</h3>
              <button className="modal-close" onClick={() => setIsCatOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            {/* List of categories */}
            <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: 'var(--space-lg)', paddingRight: '5px' }}>
              {categories.length === 0 ? (
                <p style={{ color: 'var(--gray-400)', textAlign: 'center', fontSize: '0.9rem' }}>No categories found.</p>
              ) : (
                categories.map(cat => (
                  <div
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-sm) var(--space-md)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: 'var(--space-xs)',
                      border: '1px solid var(--gray-100)'
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--gray-800)' }}>{cat.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        padding: 'var(--space-xs)'
                      }}
                      title="Delete Category"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 'var(--space-lg)' }}>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label>Add New Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Celebrations"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={catSaving}>
                {catSaving ? 'Saving...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
