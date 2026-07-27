'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEvents, formatDate } from '@/lib/firestore-db';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
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
        <h1 data-aos="fade-up"><i className="fa-solid fa-diagram-project"></i> Our Projects</h1>
        <p data-aos="fade-up" data-aos-delay="100">Explore our community initiatives and volunteer programs that make a difference in Homagama.</p>
        <div className="breadcrumb" data-aos="fade-up" data-aos-delay="200">
          <Link href="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>Projects</span>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="section">
        <div className="container">
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
                  <div className="card-img-wrapper">
                    <img className="card-img" src={p.imageURL || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600'} alt={p.title} />
                    <span className={`card-badge ${p.status === 'Upcoming' ? 'upcoming' : 'completed'}`}>{p.status}</span>
                  </div>
                  <div className="card-body">
                    <h3>{p.title}</h3>
                    <p style={{ minHeight: '60px' }}>{p.description || 'No description available for this project.'}</p>
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
