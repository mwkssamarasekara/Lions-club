'use client';

import { useEffect, useState, useRef } from 'react';
import { getSettings } from '@/lib/firestore-db';

export default function FestivalThemeEffects() {
  const [festival, setFestival] = useState('none');
  const [greeting, setGreeting] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const canvasRef = useRef(null);

  const festivalData = {
    christmas: {
      name: 'December Christmas',
      icon: 'fa-snowflake',
      accentColor: '#34d399',
      bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(22, 101, 52, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      defaultGreeting: '🎄 Merry Christmas & Happy New Year from Lions Club of Homagama Diamonds!'
    },
    vesak: {
      name: 'Vesak Festival',
      icon: 'fa-om',
      accentColor: '#fbbf24',
      bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(180, 83, 9, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
      borderColor: 'rgba(251, 191, 36, 0.3)',
      defaultGreeting: '🌸 බුදුසරණයි! ශ්‍රී වෙසක් මංගල්‍යයක් වේවා - Lions Club of Homagama Diamonds'
    },
    aluth_avurudda: {
      name: 'Sinhala & Tamil New Year',
      icon: 'fa-sun',
      accentColor: '#f97316',
      bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(194, 65, 12, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
      borderColor: 'rgba(249, 115, 22, 0.3)',
      defaultGreeting: '🌾 සිරියෙන් පිරි සුබ අලුත් අවුරුද්දක් වේවා! - Lions Club of Homagama Diamonds'
    },
    poson: {
      name: 'Poson Poya',
      icon: 'fa-dharmachakra',
      accentColor: '#60a5fa',
      bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
      borderColor: 'rgba(96, 165, 250, 0.3)',
      defaultGreeting: '🌕 පින්බර පොසොන් මංගල්‍යයක් වේවා! - Lions Club of Homagama Diamonds'
    },
    new_year: {
      name: 'Happy New Year',
      icon: 'fa-champagne-glasses',
      accentColor: '#a78bfa',
      bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(124, 58, 237, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
      borderColor: 'rgba(167, 139, 250, 0.3)',
      defaultGreeting: '🎆 Happy New Year! Wishing you joy, health & success!'
    },
    kandy_perahera: {
      name: 'Kandy Esala Perahera',
      icon: 'fa-fire',
      accentColor: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(120, 53, 15, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      defaultGreeting: '🐘 ශ්‍රී දළදා සමිඳු සරණයි! - Kandy Esala Perahera Festival'
    }
  };

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      if (data) {
        setFestival(data.activeFestival || 'none');
        setGreeting(data.festivalGreeting || '');
      }
    }
    loadSettings();

    const handleUpdate = () => loadSettings();
    window.addEventListener('lions_settings_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('lions_settings_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Subtle Executive-Grade Particle Animation Engine
  useEffect(() => {
    if (festival === 'none' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const getFestivalIcons = (fest) => {
      switch (fest) {
        case 'christmas':
          return ['❄', '❅', '❆', '✨'];
        case 'vesak':
          return ['🏮', '🪷', '✨', '🌸'];
        case 'aluth_avurudda':
          return ['🌸', '🌺', '🪔', '☀️'];
        case 'poson':
          return ['🪷', '✨', '🌕'];
        case 'new_year':
          return ['🎉', '🎊', '⭐', '✨', '🌟'];
        case 'kandy_perahera':
          return ['🔥', '✨', '🐘', '⭐'];
        default:
          return ['✨'];
      }
    };

    const symbols = getFestivalIcons(festival);
    const particles = [];
    const particleCount = festival === 'christmas' ? 50 : 35;

    for (let i = 0; i < particleCount; i++) {
      const zDepth = Math.random();
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        zDepth,
        size: zDepth * 18 + 12, // 12px to 30px elegant particle size
        speedY: (zDepth * 1.1 + 0.35),
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: zDepth * 0.4 + 0.25, // Soft, non-intrusive alpha
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        p.rotation += p.rotationSpeed;

        if (p.zDepth > 0.7) {
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
          ctx.shadowBlur = 8;
        }

        ctx.font = `${Math.round(p.size)}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
        ctx.globalAlpha = p.opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);

        ctx.restore();

        p.swayOffset += p.swaySpeed;
        p.x += Math.sin(p.swayOffset) * 0.6;

        if (festival === 'christmas' || festival === 'aluth_avurudda' || festival === 'new_year') {
          p.y += p.speedY;
          if (p.y > canvas.height + 30) {
            p.y = -30;
            p.x = Math.random() * canvas.width;
          }
        } else {
          p.y -= p.speedY * 0.75;
          if (p.y < -30) {
            p.y = canvas.height + 30;
            p.x = Math.random() * canvas.width;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [festival]);

  if (festival === 'none') return null;

  const currentTheme = festivalData[festival] || festivalData.christmas;
  const activeGreeting = greeting || currentTheme.defaultGreeting;

  return (
    <>
      {/* Particle Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 999
        }}
      />

      {/* Top Glassmorphic Festival Header Banner */}
      {!bannerDismissed && (
        <div
          style={{
            background: currentTheme.bgGradient,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${currentTheme.borderColor}`,
            color: '#ffffff',
            padding: '8px 16px',
            textAlign: 'center',
            fontSize: 'clamp(0.85rem, 2.2vw, 0.92rem)',
            fontWeight: '500',
            letterSpacing: '0.3px',
            position: 'relative',
            zIndex: 1001,
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <i className={`fa-solid ${currentTheme.icon}`} style={{ color: currentTheme.accentColor, fontSize: '1rem' }}></i>
          <span>{activeGreeting}</span>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss banner"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '8px',
              fontSize: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
    </>
  );
}
