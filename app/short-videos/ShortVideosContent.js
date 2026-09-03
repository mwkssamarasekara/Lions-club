'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getShortVideos, formatDate } from '@/lib/firestore-db';

export default function ShortVideosContent() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getShortVideos();
        setVideos(data);
        setFilteredVideos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFilter = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(v => (v.category || 'Community') === cat));
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('youtube.com/shorts/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('youtube.com/watch?v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    return url;
  };

  const categories = ['All', 'Health', 'Education', 'Community', 'Events'];

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <h1 data-aos="fade-up"><i className="fa-solid fa-video"></i> Short Videos</h1>
        <p data-aos="fade-up" data-aos-delay="100">Watch stories, reels, and video highlights of our community impact in Homagama.</p>
        <div className="breadcrumb" data-aos="fade-up" data-aos-delay="200">
          <Link href="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>Short Videos</span>
        </div>
      </section>

      {/* Videos Section */}
      <section className="section">
        <div className="container">
          {/* Category Filters */}
          <div className="toolbar" style={{ justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-tab ${category === cat ? 'active' : ''}`}
                  onClick={() => handleFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-xl)' }}>
            {loading ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="spinner"></div>
                <p>Loading short videos...</p>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <i className="fa-solid fa-film"></i>
                <p>No short videos found in this category.</p>
              </div>
            ) : (
              filteredVideos.map((video, idx) => (
                <div
                  key={video.id || idx}
                  className="card"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: 'var(--white)',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all var(--transition-base)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  data-aos="fade-up"
                  data-aos-delay={(idx % 3) * 100}
                >
                  {/* Video Thumbnail / Preview Box */}
                  <div
                    onClick={() => setActiveVideo(video)}
                    style={{
                      position: 'relative',
                      aspectRatio: '9 / 16',
                      maxHeight: '380px',
                      background: '#0b192c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.75, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)' }}></div>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'var(--gradient-gold)',
                        color: 'var(--blue-900)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)',
                        zIndex: 2,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <i className="fa-solid fa-play" style={{ marginLeft: '4px' }}></i>
                    </div>

                    <span
                      className="badge"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 2,
                        background: 'rgba(37,99,235,0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem'
                      }}
                    >
                      {video.category || 'Reel'}
                    </span>
                  </div>

                  {/* Video Details */}
                  <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3
                        onClick={() => setActiveVideo(video)}
                        style={{ fontSize: '1.05rem', color: 'var(--blue-900)', marginBottom: 'var(--space-xs)', cursor: 'pointer' }}
                      >
                        {video.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: '1.5', margin: 0 }}>
                        {video.description}
                      </p>
                    </div>
                    <div style={{ marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                      <span><i className="fa-regular fa-calendar"></i> {formatDate(video.createdAt)}</span>
                      <button
                        onClick={() => setActiveVideo(video)}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Watch Now <i className="fa-solid fa-circle-play"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="modal-overlay active" onClick={() => setActiveVideo(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '500px',
              width: '92%',
              padding: 0,
              overflow: 'hidden',
              borderRadius: 'var(--radius-xl)',
              background: '#0b192c',
              color: 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--yellow-400)' }}>
                <i className="fa-solid fa-video"></i> {activeVideo.category || 'Short Video'}
              </span>
              <button
                onClick={() => setActiveVideo(null)}
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ position: 'relative', aspectRatio: '9 / 16', width: '100%', maxHeight: '75vh', background: 'black' }}>
              {activeVideo.videoUrl && activeVideo.videoUrl.includes('.mp4') ? (
                <video src={activeVideo.videoUrl} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }}></video>
              ) : (
                <iframe
                  src={getEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                ></iframe>
              )}
            </div>

            <div style={{ padding: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', margin: '0 0 6px' }}>{activeVideo.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-300)', margin: 0, lineHeight: '1.4' }}>{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
