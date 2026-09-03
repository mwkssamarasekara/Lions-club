'use client';

import { useState, useEffect } from 'react';
import { getShortVideos, addShortVideo, deleteShortVideo, formatDate } from '@/lib/firestore-db';

export default function ShortVideosDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('Community');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getShortVideos();
      setVideos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAddOpen = () => {
    setTitle('');
    setVideoUrl('');
    setCategory('Community');
    setDescription('');
    setIsOpen(true);
  };

  const handleDelete = async (id, videoTitle) => {
    if (!confirm(`Are you sure you want to delete short video "${videoTitle}"?`)) return;
    await deleteShortVideo(id);
    loadData();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addShortVideo({
        title,
        videoUrl,
        category,
        description
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
        <h2 style={{ margin: 0 }}><i className="fa-solid fa-video" style={{ color: 'var(--purple-600)' }}></i> Short Videos</h2>
        <button className="btn btn-sm btn-primary" onClick={handleAddOpen}><i className="fa-solid fa-plus"></i> Add Short Video</button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Video Link</th>
              <th>Date Added</th>
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
            ) : videos.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <i className="fa-solid fa-film"></i>
                    <p>No short videos uploaded yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              videos.map(v => (
                <tr key={v.id}>
                  <td>
                    <strong>{v.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{v.description || 'No description'}</div>
                  </td>
                  <td>
                    <span className="badge badge-ongoing">{v.category || 'Reel'}</span>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-600)', fontSize: '0.85rem' }}>
                      <i className="fa-solid fa-arrow-up-right-from-square"></i> {v.videoUrl}
                    </a>
                  </td>
                  <td>{formatDate(v.createdAt)}</td>
                  <td>
                    <button className="action-btn delete" onClick={() => handleDelete(v.id, v.title)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isOpen && (
        <div className="modal-overlay active" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-video" style={{ color: 'var(--purple-600)' }}></i> Add Short Video</h3>
              <button className="modal-close" onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label><i className="fa-solid fa-heading"></i> Video Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Free Eye Camp Highlights 2026"
                  required
                />
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-link"></i> Video URL (YouTube Shorts / Embed Link / MP4)</label>
                <input
                  type="url"
                  className="form-control"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/shorts/VIDEO_ID or MP4 URL"
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
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Community">Community</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div className="form-group">
                <label><i className="fa-solid fa-align-left"></i> Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the short video..."
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-md)' }} disabled={saving}>
                {saving ? (
                  <>
                    <div className="spinner" style={{ width: '18px', height: '18px', margin: 0, borderWidth: '2px' }}></div> Saving...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i> Save Video
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
