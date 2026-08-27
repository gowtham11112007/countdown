import { useMemo } from 'react';
import earthTexture from './assets/earth-texture.jpg';
import moonTexture from './assets/moon-texture.jpg';

export function SpaceBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 220 }).map((_, i) => {
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

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#030014]">

      {/* ── Nebula / Cosmic Dust ── */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />

      {/* ── Stars ── */}
      <div className="absolute inset-0 z-[1]">{stars}</div>

      {/* ── Shooting Stars ── */}
      <div className="shooting-star" style={{ top: '12%', left: '70%', animationDelay: '0s' }} />
      <div className="shooting-star" style={{ top: '35%', left: '85%', animationDelay: '4s' }} />
      <div className="shooting-star" style={{ top: '8%',  left: '40%', animationDelay: '8s' }} />
      <div className="shooting-star" style={{ top: '55%', left: '60%', animationDelay: '13s' }} />

      {/* ── Earth Globe ── */}
      <div className="earth-wrapper">
        <div className="earth-atmosphere" />
        <div className="earth-globe">
          <div
            className="earth-surface"
            style={{ backgroundImage: `url(${earthTexture})` }}
          />
          <div className="earth-clouds" />
          <div className="earth-shadow" />
          <div className="earth-highlight" />
        </div>
      </div>

      {/* ── Moon (real NASA texture) ── */}
      <div className="moon-wrapper">
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
      <div className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, #030014 80%)',
        }}
      />
    </div>
  );
}
