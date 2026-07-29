'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getEvents, formatDate } from '@/lib/firestore-db';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ members: 0, projects: 0, years: 0, families: 0 });
  const statsSectionRef = useRef(null);

  // Fetch recent projects
  useEffect(() => {
    async function load() {
      try {
        const events = await getEvents();
        setProjects(events.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Animate counters when visible
  useEffect(() => {
    const targets = { members: 47, projects: 120, years: 15, families: 500 };
    let observer;

    const animate = () => {
      const duration = 1500; // ms
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        setStats({
          members: Math.floor(progress * targets.members),
          projects: Math.floor(progress * targets.projects),
          years: Math.floor(progress * targets.years),
          families: Math.floor(progress * targets.families),
        });

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setStats(targets);
        }
      };

      requestAnimationFrame(step);
    };

    if (statsSectionRef.current) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(statsSectionRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-diamond"></i>
            Lions International | District 306 D7 | CLUB NO:117049 | REGION 05 - ZONE 01
          </div>
          <h1>Empowering <span className="text-gradient">Homagama Diamonds</span> Through Service</h1>
          <p>We serve with compassion, unity, and dedication. Together, we build a brighter future for our community — one act of kindness at a time.</p>
          <div className="hero-buttons">
            <Link href="/join" className="btn btn-primary"><i className="fa-solid fa-users"></i> Join Us</Link>
            <Link href="/donate" className="btn btn-secondary"><i class="fa-solid fa-hand-holding-heart"></i> Make a Donation</Link>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,85.3C672,96,768,96,864,85.3C960,75,1056,53,1152,42.7C1248,32,1344,32,1392,32L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" ref={statsSectionRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item" data-aos="fade-up" data-aos-delay="0">
              <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
              <span className="stat-number">{stats.members}+</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="100">
              <div className="stat-icon"><i className="fa-solid fa-hands-helping"></i></div>
              <span className="stat-number">{stats.projects}+</span>
              <span className="stat-label">Projects Done</span>
            </div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
              <div className="stat-icon"><i className="fa-solid fa-calendar-check"></i></div>
              <span className="stat-number">{stats.years}+</span>
              <span className="stat-label">Years Active</span>
            </div>
            <div className="stat-item" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-icon"><i className="fa-solid fa-heart"></i></div>
              <span className="stat-number">{stats.families}+</span>
              <span className="stat-label">Families Helped</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Who We Are</h2>
            <p>Lions Club Of Homagama Diamonds is a proud branch of Lions Clubs International, dedicated to community service in the Homagama region.</p>
          </div>
          <div className="grid-3">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="0">
              <div className="feature-icon blue"><i className="fa-solid fa-eye"></i></div>
              <h3>Our Vision</h3>
              <p>To be the global leader in community and humanitarian service, creating a brighter future for all.</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon gold"><i className="fa-solid fa-bullseye"></i></div>
              <h3>Our Mission</h3>
              <p>To empower volunteers to serve their communities, meet humanitarian needs, and encourage peace through service.</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon purple"><i className="fa-solid fa-diamond"></i></div>
              <h3>Our Values</h3>
              <p>Integrity, teamwork, compassion, and excellence guide every project and initiative we undertake.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Recent Projects</h2>
            <p>See how we're making a tangible difference in the lives of people across Homagama.</p>
          </div>
          <div className="grid-3" id="recentProjects">
            {loading ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="spinner"></div>
                <p>Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <>
                <div className="feature-card" data-aos="fade-up">
                  <div className="feature-icon gold"><i className="fa-solid fa-eye"></i></div>
                  <h3>Eye Screening Camp</h3>
                  <p>Free eye screening for 200+ residents in Homagama area with support from local opticians.</p>
                </div>
                <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
                  <div className="feature-icon blue"><i className="fa-solid fa-book"></i></div>
                  <h3>School Supplies Drive</h3>
                  <p>Distributed school supplies and uniforms to 150 underprivileged students in the district.</p>
                </div>
                <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                  <div className="feature-icon purple"><i className="fa-solid fa-droplet"></i></div>
                  <h3>Blood Donation Camp</h3>
                  <p>Organized a successful blood donation camp collecting 100+ units for the national blood bank.</p>
                </div>
              </>
            ) : (
              projects.map((event, i) => (
                <div className="card" data-aos="fade-up" data-aos-delay={i * 100} key={event.id}>
                  <div className="card-img-wrapper">
                    <img className="card-img" src={event.imageURL || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600'} alt={event.title} />
                    <span className={`card-badge ${event.status === 'Upcoming' ? 'upcoming' : 'completed'}`}>{event.status}</span>
                  </div>
                  <div className="card-body">
                    <h3>{event.title}</h3>
                    <p>{event.description ? event.description.substring(0, 100) + '...' : ''}</p>
                    <div className="card-meta">
                      <span><i className="fa-regular fa-calendar"></i> {formatDate(event.date)}</span>
                      <span><i className="fa-solid fa-location-dot"></i> {event.location || 'Homagama'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-2">
            <Link href="/projects" className="btn btn-outline" data-aos="fade-up">
              <i className="fa-solid fa-arrow-right"></i> View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container" data-aos="zoom-in">
          <h2>Ready to Make a Difference?</h2>
          <p>Your contribution, no matter how small, creates ripples of positive change throughout our community.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" className="btn btn-primary"><i class="fa-solid fa-hand-holding-heart"></i> Donate Now</Link>
            <Link href="/join" className="btn btn-secondary"><i className="fa-solid fa-user-plus"></i> Become a Member</Link>
          </div>
        </div>
      </section>
    </>
  );
}
