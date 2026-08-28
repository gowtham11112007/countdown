import { useMemo, useEffect, useState } from 'react';
import moonTexture from './assets/moon-texture.jpg';

export type TimePhase = 'dawn' | 'day' | 'sunset' | 'night';

export function getTimePhase(date: Date = new Date()): { phase: TimePhase; label: string; hourFraction: number } {
  const h = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600 + date.getMilliseconds() / 3600000;
  
  if (h >= 4 && h < 8) {
    return { phase: 'dawn', label: 'Sunrise', hourFraction: h };
  } else if (h >= 8 && h < 16) {
    return { phase: 'day', label: 'Daylight', hourFraction: h };
  } else if (h >= 16 && h < 20) {
    return { phase: 'sunset', label: 'Sunset', hourFraction: h };
  } else {
    return { phase: 'night', label: 'Nighttime', hourFraction: h };
  }
}

// Perfectly smooth crossfades
function getSkyOpacities(h: number) {
  let dawn = 0, day = 0, sunset = 0, night = 0;
  const smooth = (t: number) => t * t * (3 - 2 * t);
  
  if (h >= 3 && h < 7) {
    dawn = smooth((h - 3) / 4);
    night = 1 - dawn;
  } else if (h >= 7 && h < 10) {
    day = smooth((h - 7) / 3);
    dawn = 1 - day;
  } else if (h >= 10 && h < 15) {
    day = 1;
  } else if (h >= 15 && h < 19) {
    sunset = smooth((h - 15) / 4);
    day = 1 - sunset;
  } else if (h >= 19 && h < 22) {
    night = smooth((h - 19) / 3);
    sunset = 1 - night;
  } else {
    night = 1;
  }
  
  return { dawn, day, sunset, night };
}

/* ── Premium Tech Particles ── */
const TechParticle = ({ speed, size, x, delay, color }: any) => (
  <div 
    className="absolute pointer-events-none mix-blend-screen will-change-transform rounded-sm audio-particle"
    style={{
      left: `${x}%`,
      bottom: '-5%',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      boxShadow: `0 0 ${size * 2}px ${color}`,
      animation: `tech-float ${speed}s linear infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

/* ── Rich Atmospheric Components ── */
const Cloud = ({ speed, size, top, delay, opacityMultiplier = 1 }: any) => (
  <div 
    className="absolute left-0 will-change-transform audio-cloud"
    style={{
      top: `${top}%`,
      opacity: opacityMultiplier,
      animation: `float-right ${speed}s linear infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    <div style={{ transform: `scale(${size})` }}>
      <div className="w-48 h-12 bg-white/70 rounded-full relative shadow-[0_10px_30px_rgba(255,255,255,0.2)] blur-[1px]">
        <div className="absolute w-24 h-24 bg-white/70 rounded-full -top-12 left-6" />
        <div className="absolute w-32 h-32 bg-white/70 rounded-full -top-16 left-12" />
        <div className="absolute w-20 h-20 bg-white/70 rounded-full -top-8 left-36" />
      </div>
    </div>
  </div>
);

const Bird = ({ offset, size }: any) => (
  <div className="absolute" style={{ left: offset.x, top: offset.y, transform: `scale(${size})` }}>
    <div style={{ animation: `flap ${0.3 + Math.random() * 0.3}s ease-in-out infinite alternate`, transformOrigin: 'center' }}>
      <svg width="40" height="40" viewBox="0 0 120 120" fill="currentColor">
        <path d="M10 60 C 30 20, 50 20, 60 50 C 70 20, 90 20, 110 60 C 90 40, 70 40, 60 60 C 50 40, 30 40, 10 60 Z" />
      </svg>
    </div>
  </div>
);

const Flock = ({ speed, top, delay, scale = 1, opacity }: any) => (
  <div
    className="absolute left-0 will-change-transform text-slate-800 mix-blend-multiply"
    style={{
      top: `${top}%`,
      opacity: opacity,
      animation: `fly-right ${speed}s linear infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    <div style={{ transform: `scale(${scale})` }}>
      <Bird offset={{x: 0, y: 0}} size={1} />
      <Bird offset={{x: -30, y: -20}} size={0.9} />
      <Bird offset={{x: -30, y: 20}} size={0.8} />
      <Bird offset={{x: -60, y: -40}} size={0.7} />
      <Bird offset={{x: -60, y: 40}} size={0.8} />
    </div>
  </div>
);

export function SpaceBackground() {
  const [hourFraction, setHourFraction] = useState(() => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
  });

  useEffect(() => {
    let frameId: number;
    const update = () => {
      const d = new Date();
      const h = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600 + d.getMilliseconds() / 3600000;
      setHourFraction(h);
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const h = hourFraction;
  const opacities = getSkyOpacities(h);
  
  const starOpacity = Math.max(0, 1 - opacities.day * 1.3);

  const stars = useMemo(() => {
    return Array.from({ length: 250 }).map((_, i) => {
      const size = Math.random() * 2 + 1;
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
            background: brightness > 0.8 ? '#bfdbfe' : '#ffffff',
            animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
        />
      );
    });
  }, []);

  // Premium floating digital particles mapped to hackathon brand colors
  const techParticles = useMemo(() => {
    const colors = ['#22d3ee', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'];
    return Array.from({ length: 80 }).map((_, i) => {
      const size = Math.random() > 0.7 ? (Math.random() * 3 + 2) : (Math.random() * 1.5 + 1);
      return (
        <TechParticle 
          key={i}
          speed={15 + Math.random() * 30} // 15s to 45s to float up
          size={size}
          x={Math.random() * 100} 
          delay={-(Math.random() * 45)} 
          color={colors[Math.floor(Math.random() * colors.length)]}
        />
      );
    });
  }, []);

  const cloudOpacity = Math.max(0.1, 1 - opacities.night * 0.9);
  const birdOpacity = Math.max(0, 1 - opacities.night * 1.5);

  const clouds = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => (
      <Cloud 
        key={i}
        speed={120 + Math.random() * 150} 
        size={0.4 + Math.random() * 1.2}
        top={5 + Math.random() * 45} 
        delay={-(Math.random() * 300)} 
        opacityMultiplier={0.6 + Math.random() * 0.4}
      />
    ));
  }, []);

  const flocks = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => (
      <Flock
        key={i}
        speed={40 + Math.random() * 40} 
        top={15 + Math.random() * 25}
        delay={-(Math.random() * 100)} 
        scale={0.25 + Math.random() * 0.3}
        opacity={1}
      />
    ));
  }, []);

  // Calculate the Earth-perspective arc for the Sun (6am to 6pm)
  let sunProgress = 0;
  let sunVisible = false;
  if (h >= 5 && h <= 19) { 
    sunProgress = (h - 6) / 12;
    sunVisible = true;
  }
  const sunX = sunProgress * 120 - 10;
  const sunY = Math.sin(Math.max(0, Math.min(1, sunProgress)) * Math.PI) * 75 - 10;

  // Calculate the Earth-perspective arc for the Moon (6pm to 6am)
  let moonProgress = 0;
  let moonVisible = false;
  if (h >= 17 || h <= 7) {
    const moonTime = h >= 17 ? (h - 18) : (h + 6);
    moonProgress = moonTime / 12;
    moonVisible = true;
  }
  const moonX = moonProgress * 120 - 10; 
  const moonY = Math.sin(Math.max(0, Math.min(1, moonProgress)) * Math.PI) * 75 - 10;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050a1a]">
      <style>{`
        @keyframes tech-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes float-right {
          0% { transform: translateX(-50vw); }
          100% { transform: translateX(150vw); }
        }
        @keyframes fly-right {
          0% { transform: translate(-30vw, 15vh); }
          100% { transform: translate(150vw, -25vh); }
        }
        @keyframes flap {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.3); }
        }
      `}</style>

      {/* ── Flawless, Continuous Sky Gradient Crossfades (Earth Perspective) ── */}
      {/* Night Sky - Deep Tech Indigo */}
      <div 
        className="absolute inset-0"
        style={{ opacity: opacities.night, background: 'linear-gradient(to bottom, #050a1a 0%, #0a1128 50%, #151b3b 100%)' }} 
      />
      {/* Dawn Sky - Cyber Pink to Orange */}
      <div 
        className="absolute inset-0"
        style={{ opacity: opacities.dawn, background: 'linear-gradient(to bottom, #112d4e 0%, #3f2b96 40%, #a83279 70%, #ff7b54 100%)' }} 
      />
      {/* Day Sky - Vibrant Cyan/Blue */}
      <div 
        className="absolute inset-0"
        style={{ opacity: opacities.day, background: 'linear-gradient(to bottom, #0c4a6e 0%, #1a82f7 30%, #06b6d4 70%, #b3e5fc 100%)' }} 
      />
      {/* Sunset Sky - Magenta to Purple */}
      <div 
        className="absolute inset-0"
        style={{ opacity: opacities.sunset, background: 'linear-gradient(to bottom, #1b264f 0%, #573260 40%, #90274c 70%, #f9a03f 100%)' }} 
      />

      {/* ── Sky Stars ── */}
      <div className="absolute inset-0 z-[1]" style={{ opacity: starOpacity }}>
        {stars}
      </div>
      
      {/* ── Tech Hackathon Particles (Always present, subtle high-tech feel) ── */}
      <div className="absolute inset-0 z-[1] opacity-70">
        {techParticles}
      </div>

      {/* ── The Sun (Arcing across the sky, styled as a high-end optical flare) ── */}
      <div 
        className="absolute z-[2]"
        style={{
          left: `${sunX}vw`, bottom: `${sunY}vh`,
          transform: 'translate(-50%, 50%)',
          opacity: sunVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Tech Optical Flare Lines */}
          <div className="absolute w-[200vw] h-[2px] bg-cyan-200/40 rotate-12 blur-[2px] pointer-events-none mix-blend-screen" />
          <div className="absolute w-[200vw] h-[2px] bg-purple-300/40 -rotate-12 blur-[2px] pointer-events-none mix-blend-screen" />
          
          {/* Atmospheric Tech Bloom */}
          <div className="absolute w-[100vw] h-[100vw] rounded-full bg-cyan-200/5 blur-[120px] pointer-events-none mix-blend-screen" />
          <div className="absolute w-[40vw] h-[40vw] rounded-full bg-blue-400/20 blur-[60px] pointer-events-none mix-blend-screen" />
          
          {/* Blinding Sun Core */}
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white shadow-[0_0_100px_40px_rgba(255,255,255,1),0_0_150px_60px_rgba(34,211,238,0.6)] z-10" />
        </div>
      </div>
      
      {/* ── The Moon (Arcing across the night sky, bathed in tech colors) ── */}
      <div 
        className="absolute z-[2]"
        style={{
          left: `${moonX}vw`, bottom: `${moonY}vh`,
          transform: 'translate(-50%, 50%)',
          opacity: moonVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Tech-styled moon glow */}
          <div className="absolute w-[40vw] h-[40vw] rounded-full bg-purple-500/10 blur-[80px] pointer-events-none mix-blend-screen" />
          <div className="absolute w-[20vw] h-[20vw] rounded-full bg-cyan-400/10 blur-[40px] pointer-events-none mix-blend-screen" />
          
          {/* Realistic moon globe */}
          <div className="w-16 h-16 md:w-28 md:h-28 relative shadow-[0_0_60px_20px_rgba(168,85,247,0.3)] rounded-full z-10">
            <div className="moon-globe">
              <div className="moon-surface" style={{ backgroundImage: `url(${moonTexture})` }} />
              <div className="moon-light" />
              <div className="moon-terminator" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Animated Parallax Clouds ── */}
      <div className="absolute inset-0 z-[3]" style={{ opacity: cloudOpacity, transition: 'opacity 2s' }}>
        {clouds}
      </div>

      {/* ── Animated Flocks of Birds ── */}
      <div className="absolute inset-0 z-[4]" style={{ opacity: birdOpacity, transition: 'opacity 2s' }}>
        {flocks}
      </div>

      {/* ── Horizon Dark Fade (To ground the UI) ── */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[25vh] z-[5] pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,5,0.8) 0%, transparent 100%)' }}
      />
    </div>
  );
}
