import { useMemo, useEffect, useState } from 'react';
import earthTexture from './assets/earth-texture.jpg';
import moonTexture from './assets/moon-texture.jpg';

export type TimePhase = 'dawn' | 'day' | 'sunset' | 'night';

export function getTimePhase(date: Date = new Date()): { phase: TimePhase; label: string; hourFraction: number } {
  const h = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  
  if (h >= 5 && h < 8) {
    return { phase: 'dawn', label: 'Sunrise / Dawn', hourFraction: h };
  } else if (h >= 8 && h < 17) {
    return { phase: 'day', label: 'Daylight', hourFraction: h };
  } else if (h >= 17 && h < 20) {
    return { phase: 'sunset', label: 'Sunset / Twilight', hourFraction: h };
  } else {
    return { phase: 'night', label: 'Nighttime', hourFraction: h };
  }
}

export function SpaceBackground({ currentPhase }: { currentPhase?: TimePhase }) {
  const [phaseInfo, setPhaseInfo] = useState(() => getTimePhase());

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseInfo(getTimePhase());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activePhase = currentPhase || phaseInfo.phase;

  const stars = useMemo(() => {
    return Array.from({ length: 240 }).map((_, i) => {
      const size = Math.random() * 2.8 + 0.4;
      const brightness = Math.random();
      return (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: brightness > 0.8
              ? `radial-gradient(circle, #ffffff, ${brightness > 0.9 ? '#bfdbfe' : '#fef3c7'})`
              : 'white',
            animation: `twinkle ${Math.random() * 5 + 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 6}s`,
            opacity: Math.random() * 0.6 + 0.2,
            boxShadow: size > 2 ? `0 0 ${size * 2}px rgba(255,255,255,0.3)` : 'none',
          }}
        />
      );
    });
  }, []);

  // Theme configuration for each phase
  const themeStyles = {
    day: {
      bg: 'linear-gradient(to bottom, #040f28 0%, #091b3e 60%, #0c234a 100%)',
      nebula1: 'radial-gradient(circle, #38bdf8, #0284c7, transparent 70%)',
      nebula2: 'radial-gradient(circle, #fbbf24, #ea580c, transparent 70%)',
      nebula3: 'radial-gradient(circle, #60a5fa, #2563eb, transparent 70%)',
      atmoGlow: 'rgba(56, 189, 248, 0.28)',
      earthShadow: 'linear-gradient(75deg, transparent 0%, transparent 55%, rgba(0, 0, 0, 0.2) 75%, rgba(0, 0, 0, 0.7) 100%)',
      starOpacity: '0.45',
      sunFlare: 'radial-gradient(circle at 10% 10%, rgba(254, 240, 138, 0.25) 0%, rgba(56, 189, 248, 0.12) 35%, transparent 70%)',
      moonOpacity: '0.5'
    },
    sunset: {
      bg: 'linear-gradient(to bottom, #160826 0%, #2a0e3b 50%, #170524 100%)',
      nebula1: 'radial-gradient(circle, #f97316, #ea580c, transparent 70%)',
      nebula2: 'radial-gradient(circle, #d946ef, #9333ea, transparent 70%)',
      nebula3: 'radial-gradient(circle, #f43f5e, #be123c, transparent 70%)',
      atmoGlow: 'rgba(249, 115, 22, 0.35)',
      earthShadow: 'linear-gradient(110deg, transparent 0%, transparent 40%, rgba(234, 88, 12, 0.25) 55%, rgba(0, 0, 0, 0.85) 85%)',
      starOpacity: '0.75',
      sunFlare: 'radial-gradient(circle at 15% 40%, rgba(249, 115, 22, 0.3) 0%, rgba(217, 70, 239, 0.15) 45%, transparent 70%)',
      moonOpacity: '0.85'
    },
    night: {
      bg: 'linear-gradient(to bottom, #030014 0%, #06021c 60%, #02000a 100%)',
      nebula1: 'radial-gradient(circle, #6366f1, #4f46e5, transparent 70%)',
      nebula2: 'radial-gradient(circle, #a855f7, #7e22ce, transparent 70%)',
      nebula3: 'radial-gradient(circle, #06b6d4, #0891b2, transparent 70%)',
      atmoGlow: 'rgba(56, 189, 248, 0.15)',
      earthShadow: 'linear-gradient(105deg, transparent 0%, transparent 35%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.95) 80%)',
      starOpacity: '1.0',
      sunFlare: 'none',
      moonOpacity: '1.0'
    },
    dawn: {
      bg: 'linear-gradient(to bottom, #0b0c2a 0%, #1a1542 50%, #28143d 100%)',
      nebula1: 'radial-gradient(circle, #38bdf8, #0284c7, transparent 70%)',
      nebula2: 'radial-gradient(circle, #ec4899, #be185d, transparent 70%)',
      nebula3: 'radial-gradient(circle, #818cf8, #4338ca, transparent 70%)',
      atmoGlow: 'rgba(236, 72, 153, 0.3)',
      earthShadow: 'linear-gradient(95deg, transparent 0%, transparent 45%, rgba(236, 72, 153, 0.2) 60%, rgba(0, 0, 0, 0.85) 90%)',
      starOpacity: '0.6',
      sunFlare: 'radial-gradient(circle at 85% 70%, rgba(244, 114, 182, 0.25) 0%, rgba(56, 189, 248, 0.1) 50%, transparent 75%)',
      moonOpacity: '0.65'
    }
  };

  const theme = themeStyles[activePhase];

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-1000 ease-in-out"
      style={{ background: theme.bg }}
    >
      {/* ── Solar / Twilight Lens Flare Ambient Overlay ── */}
      {theme.sunFlare !== 'none' && (
        <div 
          className="absolute inset-0 transition-opacity duration-1000 z-[1]"
          style={{ background: theme.sunFlare }}
        />
      )}

      {/* ── Nebula / Cosmic Dust ── */}
      <div className="nebula nebula-1 transition-all duration-1000" style={{ background: theme.nebula1 }} />
      <div className="nebula nebula-2 transition-all duration-1000" style={{ background: theme.nebula2 }} />
      <div className="nebula nebula-3 transition-all duration-1000" style={{ background: theme.nebula3 }} />

      {/* ── Stars ── */}
      <div 
        className="absolute inset-0 z-[2] transition-opacity duration-1000"
        style={{ opacity: theme.starOpacity }}
      >
        {stars}
      </div>

      {/* ── Shooting Stars ── */}
      <div className="shooting-star" style={{ top: '12%', left: '70%', animationDelay: '0s' }} />
      <div className="shooting-star" style={{ top: '35%', left: '85%', animationDelay: '4s' }} />
      <div className="shooting-star" style={{ top: '8%',  left: '40%', animationDelay: '8s' }} />
      <div className="shooting-star" style={{ top: '55%', left: '60%', animationDelay: '13s' }} />

      {/* ── Earth Globe ── */}
      <div className="earth-wrapper">
        <div 
          className="earth-atmosphere transition-all duration-1000" 
          style={{
            background: `radial-gradient(circle, transparent 55%, ${theme.atmoGlow} 72%, transparent 90%)`
          }}
        />
        <div className="earth-globe">
          <div
            className="earth-surface"
            style={{ backgroundImage: `url(${earthTexture})` }}
          />
          <div className="earth-clouds" />
          <div 
            className="earth-shadow transition-all duration-1000" 
            style={{ background: theme.earthShadow }}
          />
          <div className="earth-highlight" />
        </div>
      </div>

      {/* ── Moon ── */}
      <div 
        className="moon-wrapper transition-opacity duration-1000"
        style={{ opacity: theme.moonOpacity }}
      >
        <div className="moon-glow" />
        <div className="moon-globe">
          <div
            className="moon-surface"
            style={{ backgroundImage: `url(${moonTexture})` }}
          />
          <div className="moon-light" />
          <div className="moon-terminator" />
        </div>
      </div>

      {/* ── Deep space vignette ── */}
      <div 
        className="absolute inset-0 z-[5] pointer-events-none transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,0,20,0.7) 85%)',
        }}
      />
    </div>
  );
}
