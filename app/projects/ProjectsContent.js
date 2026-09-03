'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEvents, getProjectDocuments, formatDate } from '@/lib/firestore-db';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [projData, docData] = await Promise.all([
          getEvents(),
          getProjectDocuments()
        ]);
        setProjects(projData);
        setFilteredProjects(projData);
        setDocuments(docData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFilter = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.status === status));
    }
  };

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <h1 data-aos="fade-up"><i className="fa-solid fa-diagram-project"></i> Our Projects & Reports</h1>
        <p data-aos="fade-up" data-aos-delay="100">Explore community initiatives, volunteer programs, and official project PDF documents in Homagama.</p>
        <div className="breadcrumb" data-aos="fade-up" data-aos-delay="200">
          <Link href="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>Projects</span>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Featured Initiatives</h2>
            <p>Our ongoing, upcoming, and completed community service activities.</p>
          </div>

          {/* Toolbar with filter tabs */}
          <div className="toolbar" style={{ justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`} 
                onClick={() => handleFilter('all')}
              >
                All Projects
              </button>
              <button 
                className={`filter-tab ${filter === 'Upcoming' ? 'active' : ''}`} 
                onClick={() => handleFilter('Upcoming')}
              >
                <i className="fa-solid fa-calendar-day"></i> Upcoming
              </button>
              <button 
                className={`filter-tab ${filter === 'Ongoing' ? 'active' : ''}`} 
                onClick={() => handleFilter('Ongoing')}
              >
                <i className="fa-solid fa-spinner"></i> Ongoing
              </button>
              <button 
                className={`filter-tab ${filter === 'Completed' ? 'active' : ''}`} 
                onClick={() => handleFilter('Completed')}
              >
                <i className="fa-solid fa-check-double"></i> Completed
              </button>
            </div>
          </div>

          <div className="grid-3" id="projectsGrid">
            {loading ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="spinner"></div>
                <p>Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <i className="fa-solid fa-folder-open"></i>
                <p>No projects found in this category.</p>
              </div>
            ) : (
              filteredProjects.map((p, i) => (
                <div className="card fade-in-card" data-aos="fade-up" data-aos-delay={(i % 3) * 100} key={p.id}>
                  <div className="card-img-wrapper" onClick={() => setSelectedProject(p)} style={{ cursor: 'pointer' }}>
                    <img className="card-img" src={p.imageURL || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600'} alt={p.title} />
                    <span className={`card-badge ${(p.status || 'Upcoming').toLowerCase()}`}>{p.status}</span>
                  </div>
                  <div className="card-body">
                    <h3 onClick={() => setSelectedProject(p)} style={{ cursor: 'pointer', transition: 'color var(--transition-fast)' }} className="project-card-title">{p.title}</h3>
                    <p style={{ minHeight: '60px' }}>{p.description ? p.description.substring(0, 100) + '...' : 'No description available for this project.'}</p>
                    <div className="card-meta">
                      <span><i className="fa-regular fa-calendar"></i> {formatDate(p.date)}</span>
                      <span><i className="fa-solid fa-location-dot"></i> {p.location || 'Homagama'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Project PDF Documents Section */}
      <section className="section" style={{ background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2><i className="fa-solid fa-file-pdf" style={{ color: 'var(--danger)' }}></i> Project Reports & Documents</h2>
            <p>Access official project proposals, impact reports, and documentation. Click any document to view it in full screen.</p>
          </div>

          <div className="grid-3">
            {loading ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="spinner"></div>
                <p>Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <i className="fa-solid fa-file-excel"></i>
                <p>No project documents available right now.</p>
              </div>
            ) : (
              documents.map((doc, i) => (
                <div 
                  key={doc.id || i}
                  className="card"
                  style={{
                    padding: 'var(--space-lg)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--white)',
                    border: '1px solid var(--gray-200)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease'
                  }}
                  data-aos="fade-up"
                  data-aos-delay={(i % 3) * 100}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        <i className="fa-solid fa-file-pdf"></i>
                      </div>
                      <span className="badge" style={{ background: 'var(--blue-50)', color: 'var(--blue-700)', fontSize: '0.75rem' }}>
                        {doc.projectTitle || 'Project Doc'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-900)', marginBottom: 'var(--space-xs)' }}>
                      {doc.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: '1.5', margin: '0 0 var(--space-md)' }}>
                      {doc.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-regular fa-clock"></i> Uploaded: {formatDate(doc.uploadedAt)}
                    </div>

                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => setSelectedDoc(doc)}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-expand"></i> Open Document (PDF)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="modal-overlay active" onClick={() => setSelectedProject(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', padding: 0 }}>
            <div style={{ position: 'relative' }}>
              <button className="modal-close" onClick={() => setSelectedProject(null)} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div style={{ height: '350px' }}>
                <img src={selectedProject.imageURL || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600'} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--white)' }}>
                <span className={`badge badge-${(selectedProject.status || 'Upcoming').toLowerCase()}`} style={{ alignSelf: 'flex-start', marginBottom: 'var(--space-sm)' }}>{selectedProject.status}</span>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--blue-900)', marginBottom: 'var(--space-sm)' }}>{selectedProject.title}</h2>
                <div className="card-meta" style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: 'var(--space-md)', borderBottom: '1px solid var(--gray-100)', paddingBottom: 'var(--space-sm)' }}>
                  <span><i className="fa-regular fa-calendar"></i> {formatDate(selectedProject.date)}</span>
                  <span><i className="fa-solid fa-location-dot"></i> {selectedProject.location || 'Homagama'}</span>
                </div>
                <p style={{ color: 'var(--gray-600)', lineHeight: '1.6', fontSize: '0.95rem', overflowY: 'auto', maxHeight: '180px', paddingRight: '5px' }}>
                  {selectedProject.description || 'No description available for this project.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Document Large Viewer Modal */}
      {selectedDoc && (
        <div className="modal-overlay active" onClick={() => setSelectedDoc(null)}>
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '1000px', 
              width: '95%', 
              height: '90vh',
              maxHeight: '900px',
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden', 
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff'
            }}
          >
            {/* PDF Header */}
            <div style={{ padding: '14px 20px', background: 'var(--blue-900)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-file-pdf" style={{ color: 'var(--danger)', fontSize: '1.4rem' }}></i>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'white' }}>{selectedDoc.title}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray-300)' }}>Project: {selectedDoc.projectTitle || 'General'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a 
                  href={selectedDoc.pdfUrl} 
                  download={selectedDoc.fileName || 'Document.pdf'}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-sm btn-outline" 
                  style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <i className="fa-solid fa-download"></i> Download PDF
                </a>
                <button 
                  onClick={() => setSelectedDoc(null)} 
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* PDF Iframe Viewer */}
            <div style={{ flex: 1, background: '#525659', width: '100%', height: '100%' }}>
              <iframe 
                src={selectedDoc.pdfUrl} 
                title={selectedDoc.title} 
                style={{ width: '100%', height: '100%', border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container" data-aos="zoom-in">
          <h2>Support Our Initiatives</h2>
          <p>Help us fund upcoming community projects. Every contribution brings us closer to a stronger community.</p>
          <Link href="/donate" className="btn btn-primary"><i className="fa-solid fa-hand-holding-heart"></i> Support a Project</Link>
        </div>
      </section>
    </>
  );
}
