'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMembers } from '@/lib/firestore-db';

const positionOrder = {
  'President': 1,
  'Secretary': 2,
  'Treasurer': 3,
  'Director': 4,
  'Vice President': 5,
  'Past President': 6,
  'Member': 7
};

function getPositionWeight(position) {
  if (!position) return 99;
  if (positionOrder[position] !== undefined) return positionOrder[position];
  const posLower = position.toLowerCase();
  if (posLower.includes('president')) return 1.5;
  if (posLower.includes('secretary')) return 2;
  if (posLower.includes('treasurer')) return 3;
  if (posLower.includes('coordinator') || posLower.includes('admin')) return 4.5;
  if (posLower.includes('director')) return 5;
  return 7;
}

export default function About() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMembers();
        // Sort
        data.sort((a, b) => {
          const weightA = getPositionWeight(a.position);
          const weightB = getPositionWeight(b.position);
          if (weightA !== weightB) return weightA - weightB;
          return (a.name || '').localeCompare(b.name || '');
        });
        setMembers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visibleMembers = showAll ? members : members.slice(0, 8);

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <h1 data-aos="fade-up">About Us</h1>
        <p data-aos="fade-up" data-aos-delay="100">Discover our story, mission, and the passionate people behind Lions Diamond Homagama.</p>
        <div className="breadcrumb" data-aos="fade-up" data-aos-delay="200">
          <Link href="/">Home</Link>
          <i className="fa-solid fa-chevron-right"></i>
          <span>About Us</span>
        </div>
      </section>

      {/* History */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div data-aos="fade-right">
              <h2 style={{ marginBottom: 'var(--space-lg)' }}>Our <span className="text-gradient">Story</span></h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem', marginBottom: 'var(--space-md)' }}>
                Lions Diamond Homagama was established as part of Lions Clubs International — the world's largest service club organization with over 1.4 million members in more than 200 countries and geographic areas.
              </p>
              <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-md)' }}>
                Based in Homagama, Sri Lanka, our club has been a cornerstone of community service for over 15 years. From organizing health camps and educational programs to disaster relief and environmental initiatives, we strive to make a lasting impact.
              </p>
              <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-lg)' }}>
                Our motto — <strong style={{ color: 'var(--yellow-600)' }}>"We Serve"</strong> — is more than words. It's our way of life. Every member brings unique skills, passion, and dedication to the table, united by the common goal of uplifting our community.
              </p>
              <Link href="/join" className="btn btn-primary mt-1"><i className="fa-solid fa-users"></i> Join Our Family</Link>
            </div>
            <div data-aos="fade-left">
              <img src="/assets/img/hero-bg.jpg" alt="Lions Club Service" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', maxHeight: '400px', objectFit: 'cover', width: '100%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="grid-3">
            <div className="glass-card" style={{ background: 'var(--gradient-blue)', color: 'white', padding: 'var(--space-2xl)' }} data-aos="fade-up" data-aos-delay="0">
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}><i className="fa-solid fa-eye"></i></div>
              <h3 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>Vision</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0 }}>To be the global leader in community and humanitarian service, empowering every individual to reach their full potential.</p>
            </div>
            <div className="glass-card" style={{ background: 'var(--gradient-gold)', color: 'var(--blue-900)', padding: 'var(--space-2xl)' }} data-aos="fade-up" data-aos-delay="100">
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}><i className="fa-solid fa-bullseye"></i></div>
              <h3 style={{ color: 'var(--blue-900)', marginBottom: 'var(--space-md)' }}>Mission</h3>
              <p style={{ color: 'var(--blue-800)', margin: 0 }}>To empower volunteers to serve communities, meet humanitarian needs, encourage peace, and promote international understanding.</p>
            </div>
            <div className="glass-card" style={{ background: 'var(--gradient-purple)', color: 'white', padding: 'var(--space-2xl)' }} data-aos="fade-up" data-aos-delay="200">
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}><i className="fa-solid fa-diamond"></i></div>
              <h3 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>Values</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0 }}>Integrity, accountability, teamwork, respect for diversity, compassion, and excellence in service delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2>Our Leadership</h2>
            <p>Meet the dedicated individuals who guide our club's vision and service initiatives.</p>
          </div>

          <div className="grid-4" id="leadershipTeam">
            {loading ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="spinner"></div>
                <p>Loading leadership team...</p>
              </div>
            ) : members.length === 0 ? (
              <>
                <div className="team-card role-president" data-aos="fade-up">
                  <div className="team-card-avatar-wrapper">
                    <div className="team-card-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-900)', fontSize: '2.2rem' }}><i className="fa-solid fa-user"></i></div>
                  </div>
                  <h4>President</h4>
                  <p className="position">Club President</p>
                </div>
                <div className="team-card role-officer" data-aos="fade-up" data-aos-delay="100">
                  <div className="team-card-avatar-wrapper">
                    <div className="team-card-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-600)', fontSize: '2.2rem' }}><i className="fa-solid fa-user"></i></div>
                  </div>
                  <h4>Secretary</h4>
                  <p className="position">Club Secretary</p>
                </div>
                <div className="team-card role-officer" data-aos="fade-up" data-aos-delay="200">
                  <div className="team-card-avatar-wrapper">
                    <div className="team-card-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-600)', fontSize: '2.2rem' }}><i className="fa-solid fa-user"></i></div>
                  </div>
                  <h4>Treasurer</h4>
                  <p className="position">Club Treasurer</p>
                </div>
                <div className="team-card role-coordinator" data-aos="fade-up" data-aos-delay="300">
                  <div className="team-card-avatar-wrapper">
                    <div className="team-card-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-600)', fontSize: '2.2rem' }}><i className="fa-solid fa-user"></i></div>
                  </div>
                  <h4>Coordinator</h4>
                  <p className="position">Social Administrator & Coordinator</p>
                </div>
              </>
            ) : (
              visibleMembers.map((m, i) => {
                const posLower = (m.position || '').toLowerCase();
                let roleClass = '';
                if (posLower.includes('president')) roleClass = 'role-president';
                else if (posLower.includes('secretary') || posLower.includes('treasurer')) roleClass = 'role-officer';
                else if (posLower.includes('coordinator') || posLower.includes('director') || posLower.includes('admin')) roleClass = 'role-coordinator';

                return (
                  <div 
                    className={`team-card ${roleClass} fade-in-card`} 
                    data-aos="fade-up" 
                    data-aos-delay={(i % 4) * 100}
                    key={m.id}
                  >
                    <div className="team-card-avatar-wrapper">
                      {m.photoURL ? (
                        <img className="team-card-avatar" src={m.photoURL} alt={m.name} loading="lazy" />
                      ) : (
                        <div className="team-card-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', fontSize: '2.2rem' }}><i className="fa-solid fa-user"></i></div>
                      )}
                    </div>
                    <h4>{m.name}</h4>
                    <p className="position">{m.position || 'Member'}</p>
                  </div>
                );
              })
            )}
          </div>

          {members.length > 8 && (
            <div className="text-center mt-3" id="loadMoreContainer">
              <button 
                className="btn btn-outline" 
                id="btnLoadMore" 
                style={{ gap: 'var(--space-md)' }}
                onClick={() => setShowAll(!showAll)}
              >
                <i className={`fa-solid ${showAll ? 'fa-angles-up' : 'fa-angles-down'}`}></i> 
                {showAll ? ' See Less' : ' See More Members'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container" data-aos="zoom-in">
          <h2>Be Part of Something Greater</h2>
          <p>Join a community of changemakers dedicated to service and compassion.</p>
          <Link href="/join" className="btn btn-primary"><i className="fa-solid fa-user-plus"></i> Become a Lion</Link>
        </div>
      </section>
    </>
  );
}
