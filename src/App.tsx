import { useState, useEffect } from 'react';
import { SpaceBackground } from './SpaceBackground';

/**
 * Returns the Date object representing the target end time (8:00 AM tomorrow).
 * If current time is past 8:00 AM today, target is 8:00 AM tomorrow.
 */
function getTarget8AM(now: Date = new Date()): Date {
  const target = new Date(now);
  target.setHours(8, 0, 0, 0); // 8:00:00 AM
  
  // If current time is past today's 8:00 AM, target 8:00 AM tomorrow
  if (now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  
  return target;
}

function App() {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Trigger cosmic shockwave pulse animation
  const triggerPulseAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  useEffect(() => {
    const updateSyncTimer = () => {
      const now = new Date();
      const target = getTarget8AM(now);
      const remaining = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));

      // Trigger animation when target 8:00 AM is reached
      if (remaining === 0) {
        triggerPulseAnimation();
      }

      setRemainingSeconds(remaining);
    };

    updateSyncTimer();
    const interval = setInterval(updateSyncTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format hours, minutes, seconds zero-padded
  const h = Math.floor(remainingSeconds / 3600);
  const m = Math.floor((remainingSeconds % 3600) / 60);
  const s = Math.floor(remainingSeconds % 60);

  const hStr = h.toString().padStart(2, '0');
  const mStr = m.toString().padStart(2, '0');
  const sStr = s.toString().padStart(2, '0');

  return (
    <div 
      onClick={() => triggerPulseAnimation()}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white selection:bg-white/10 font-sans relative overflow-hidden select-none cursor-pointer py-12 px-4"
      title="Click to trigger cosmic pulse animation"
    >
      {/* Space Theme Background */}
      <SpaceBackground />

      {/* Cosmic shockwave ring */}
      {isAnimating && <div className="shockwave-ring z-10" />}

      {/* Futuristic Header Title */}
      <header className="relative z-10 mb-8 md:mb-14 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider uppercase font-sans drop-shadow-[0_0_40px_rgba(56,189,248,0.4)]">
          <span className="bg-gradient-to-r from-sky-300 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            TECH SANGAMAM 2026
          </span>
        </h1>
      </header>

      {/* Main Timer Display - Synced Countdown to 8:00 AM tomorrow */}
      <div className={`relative z-10 flex items-center justify-center gap-2 md:gap-6 tabular-nums transition-all duration-1000 ${isAnimating ? 'animate-nine-start' : ''}`}>
        <TimeBlock value={hStr} label="HOURS" />
        <Separator />
        <TimeBlock value={mStr} label="MINUTES" />
        <Separator />
        <TimeBlock value={sStr} label="SECONDS" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center relative">
      <div className="flex justify-center min-w-[1.4em] font-orbitron font-bold tabular-nums text-[6rem] sm:text-[9rem] md:text-[11rem] lg:text-[14rem] leading-none tracking-tight text-white drop-shadow-[0_0_35px_rgba(56,189,248,0.7)] drop-shadow-[0_0_80px_rgba(168,85,247,0.35)] transition-all duration-1000">
        {value}
      </div>
      <div className="absolute top-full mt-2 md:mt-6 text-[10px] md:text-sm font-semibold tracking-[0.4em] text-white/40 uppercase font-sans">
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="text-[6rem] sm:text-[9rem] md:text-[11rem] lg:text-[14rem] font-orbitron font-bold leading-none -translate-y-2 md:-translate-y-6 text-white drop-shadow-[0_0_35px_rgba(56,189,248,0.7)] drop-shadow-[0_0_80px_rgba(168,85,247,0.35)] transition-all duration-1000">
      :
    </div>
  );
}

export default App;
