'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/firestore-db';

export default function FestivalsDashboard() {
  const [activeFestival, setActiveFestival] = useState('none');
  const [festivalGreeting, setFestivalGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const festivals = [
    {
      id: 'none',
      name: 'Default / Standard Theme',
      icon: 'fa-ban',
      color: 'var(--gray-600)',
      bg: 'var(--gray-100)',
      desc: 'Standard website appearance without festival animations or top banners.',
      defaultMsg: ''
    },
    {
      id: 'christmas',
      name: 'December Christmas',
      icon: 'fa-snowflake',
      color: '#ef4444',
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(34, 197, 94, 0.15) 100%)',
      desc: 'Snowfall particle animation (hima watenawa), Christmas tree sparkles, and festive top banner.',
      defaultMsg: '🎄 Merry Christmas & Happy New Year from Lions Club of Homagama Diamonds!'
    },
    {
      id: 'vesak',
      name: 'Vesak Festival',
      icon: 'fa-om',
      color: '#f59e0b',
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
      desc: 'Animated floating Vesak lanterns (කූඩු) drifting upwards, lotus flower ambient lights.',
      defaultMsg: '🌸 බුදුසරණයි! ශ්‍රී වෙසක් මංගල්‍යයක් වේවා - Lions Club of Homagama Diamonds'
    },
    {
      id: 'aluth_avurudda',
      name: 'Sinhala & Tamil New Year',
      icon: 'fa-sun',
      color: '#ea580c',
      bg: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
      desc: 'Drifting red Erabadu flower petals, traditional oil lamp flame glow, and festive greeting banner.',
      defaultMsg: '🌾 සිරියෙන් පිරි සුබ අලුත් අවුරුද්දක් වේවා! - Lions Club of Homagama Diamonds'
    },
    {
      id: 'poson',
      name: 'Poson Poya',
      icon: 'fa-dharmachakra',
      color: '#2563eb',
      bg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
      desc: 'Mihintale Stupa starlight beams, floating lotus petals, and spiritual aura.',
      defaultMsg: '🌕 පින්බර පොසොන් මංගල්‍යයක් වේවා! - Lions Club of Homagama Diamonds'
    },
    {
      id: 'new_year',
      name: 'Happy New Year (Jan 1)',
      icon: 'fa-champagne-glasses',
      color: '#7c3aed',
      bg: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
      desc: 'Celebratory fireworks animation and golden confetti burst with new year greeting banner.',
      defaultMsg: '🎆 Happy New Year! Wishing you joy, health & success!'
    },
    {
      id: 'kandy_perahera',
      name: 'Kandy Esala Perahera',
      icon: 'fa-fire',
      color: '#b45309',
      bg: 'linear-gradient(135deg, rgba(180, 83, 9, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
      desc: 'Flame spark particles, golden traditional Lankan decorative motifs, and perahera banner.',
      defaultMsg: '🐘 ශ්‍රී දළදා සමිඳු සරණයි! - Kandy Esala Perahera Festival'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getSettings();
      if (data) {
        setActiveFestival(data.activeFestival || 'none');
        setFestivalGreeting(data.festivalGreeting || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleActivate = async (festId, defaultMsg) => {
    setSaving(true);
    try {
      const newGreeting = festivalGreeting || defaultMsg;
      await updateSettings({
        activeFestival: festId,
        festivalGreeting: newGreeting
      });
      setActiveFestival(festId);
      if (!festivalGreeting && defaultMsg) {
        setFestivalGreeting(defaultMsg);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGreeting = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        festivalGreeting
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const currentFestObj = festivals.find(f => f.id === activeFestival) || festivals[0];

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h2 style={{ margin: 0 }}><i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--purple-600)' }}></i> Festival Sessions</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--gray-500)', fontSize: '0.9rem' }}>Activate festive theme sessions with real-time home page animations & top greeting banners.</p>
        </div>
      </div>

      {/* Currently Active Banner Card */}
      <div
        className="card"
        style={{
          padding: 'var(--space-xl)',
          borderRadius: 'var(--radius-lg)',
          background: currentFestObj.bg,
          border: '2px solid var(--purple-400)',
          marginBottom: 'var(--space-2xl)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: currentFestObj.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <i className={`fa-solid ${currentFestObj.icon}`}></i>
            </div>
            <div>
              <span className="badge badge-success" style={{ marginBottom: '4px' }}>Active Session</span>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--blue-900)' }}>{currentFestObj.name}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--gray-600)' }}>{currentFestObj.desc}</p>
            </div>
          </div>

          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-globe"></i> Preview Website
          </a>
        </div>
      </div>

      {/* Greeting Message Form */}
      <div className="card" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', background: 'var(--white)', marginBottom: 'var(--space-2xl)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-900)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-bullhorn" style={{ color: 'var(--yellow-600)' }}></i> Festival Greeting Message
        </h3>
        <form onSubmit={handleSaveGreeting}>
          <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
            <input
              type="text"
              className="form-control"
              value={festivalGreeting}
              onChange={(e) => setFestivalGreeting(e.target.value)}
              placeholder="e.g. 🎄 Merry Christmas from Lions Club of Homagama Diamonds!"
            />
          </div>
          <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
            <i className="fa-solid fa-save"></i> Save Greeting Message
          </button>
        </form>
      </div>

      {/* Festival Themes Grid */}
      <h3 style={{ fontSize: '1.2rem', color: 'var(--blue-900)', marginBottom: 'var(--space-lg)' }}>Available Festival Sessions</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
        {festivals.map(fest => {
          const isActive = activeFestival === fest.id;
          return (
            <div
              key={fest.id}
              className="card"
              style={{
                padding: 'var(--space-lg)',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--white)',
                border: isActive ? '2px solid var(--purple-600)' : '1px solid var(--gray-200)',
                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: fest.bg,
                      color: fest.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}
                  >
                    <i className={`fa-solid ${fest.icon}`}></i>
                  </div>

                  {isActive ? (
                    <span className="badge badge-success"><i className="fa-solid fa-check"></i> Active</span>
                  ) : (
                    <span className="badge badge-upcoming" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>Inactive</span>
                  )}
                </div>

                <h4 style={{ fontSize: '1.1rem', color: 'var(--blue-900)', margin: '0 0 6px' }}>{fest.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: '1.5', margin: '0 0 var(--space-lg)' }}>
                  {fest.desc}
                </p>
              </div>

              <button
                className={`btn btn-sm ${isActive ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => handleActivate(fest.id, fest.defaultMsg)}
                disabled={saving || isActive}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isActive ? (
                  <>
                    <i className="fa-solid fa-circle-check"></i> Session Active
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-bolt"></i> Activate Session
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
