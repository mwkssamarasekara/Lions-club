'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGalleryImages } from '@/lib/firestore-db';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === cat));
    }
  };

  const categories = ['All', 'Service', 'Education', 'Health', 'Donations', 'Meetings'];

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <h1 data-aos="fade-up"><i className="fa-solid fa-images"></i> Media Gallery</h1>
        <p data-aos="fade-up" data-aos-delay="100">Capturing moments of hope, service, and togetherness in our community initiatives.</p>
        <div className="breadcrumb" data-aos="fade-up" data-aos-delay="200">
          <Link href="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>Gallery</span>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section">
        <div className="container">
          {/* Category Filter Tabs */}
          <div className="toolbar" style={{ justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`filter-tab ${category === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
            {loading ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="spinner"></div>
                <p>Loading gallery images...</p>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <i className="fa-solid fa-images"></i>
                <p>No photos found in this category.</p>
              </div>
            ) : (
              filteredImages.map((img, idx) => (
                <div 
                  className="gallery-item fade-in-card" 
                  data-aos="fade-up" 
                  data-aos-delay={(idx % 4) * 100}
                  key={img.id}
                  onClick={() => setLightboxIndex(idx)}
                  style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', height: '240px' }}
                >
                  <img 
                    src={img.imageURL} 
                    alt={img.title || 'Gallery image'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
                    className="gallery-img-hover"
                  />
                  <div className="gallery-item-overlay">
                    <span style={{ fontSize: '1rem', fontWeight: '700' }}>{img.title || 'View Image'}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{img.category}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Component */}
      {lightboxIndex !== null && (
        <div className="lightbox active" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          <button 
            className="lightbox-nav prev" 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + filteredImages.length - 1) % filteredImages.length);
            }}
            style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <img 
            src={filteredImages[lightboxIndex].imageURL} 
            alt={filteredImages[lightboxIndex].title} 
            onClick={(e) => e.stopPropagation()} 
          />

          <button 
            className="lightbox-nav next" 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
            }}
            style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          <div style={{ position: 'absolute', bottom: '20px', color: 'white', textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '20px' }}>
            <h4 style={{ margin: 0 }}>{filteredImages[lightboxIndex].title || 'Untitled'}</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{filteredImages[lightboxIndex].category}</p>
          </div>
        </div>
      )}
    </>
  );
}
