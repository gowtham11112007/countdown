import { useState, useEffect } from 'react';
import { SpaceBackground, getTimePhase, TimePhase } from './SpaceBackground';

const DAY_SECONDS = 24 * 60 * 60; // 86,400 seconds in 24 hours

/**
 * Returns the Date object representing the start of the current 24-hour cycle (8:00 AM).
 * If current local time is before 8:00 AM (e.g. 07:30 AM), the current cycle started at 8:00 AM yesterday.
 */
function getCurrentCycleStart(now: Date = new Date()): Date {
  const start = new Date(now);
  start.setHours(8, 0, 0, 0); // 8:00:00 AM today
  if (now.getTime() < start.getTime()) {
    start.setDate(start.getDate() - 1); // 8:00:00 AM yesterday
  }
  return start;
}

function App() {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(DAY_SECONDS);
  const [currentPhase, setCurrentPhase] = useState<TimePhase>(() => getTimePhase().phase);

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
      
      // Update Day/Night time-of-day phase
      const phaseData = getTimePhase(now);
      setCurrentPhase(phaseData.phase);

      // Current 8:00 AM cycle start
      const cycleStart = getCurrentCycleStart(now);
      const elapsedInCycle = Math.floor((now.getTime() - cycleStart.getTime()) / 1000);
      const remaining = Math.max(0, DAY_SECONDS - elapsedInCycle);

      // Trigger animation at 8:00:00 AM boundary
      if (elapsedInCycle === 0) {
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

  // Dynamic glow styles matching real-world day/night phase
  const phaseGlows: Record<TimePhase, string> = {
    day: 'drop-shadow-[0_0_35px_rgba(56,189,248,0.8)] drop-shadow-[0_0_80px_rgba(251,191,36,0.35)] text-sky-100',
    sunset: 'drop-shadow-[0_0_35px_rgba(249,115,22,0.85)] drop-shadow-[0_0_80px_rgba(217,70,239,0.45)] text-amber-100',
    night: 'drop-shadow-[0_0_35px_rgba(168,85,247,0.8)] drop-shadow-[0_0_80px_rgba(99,102,241,0.4)] text-indigo-100',
    dawn: 'drop-shadow-[0_0_35px_rgba(244,114,182,0.85)] drop-shadow-[0_0_80px_rgba(56,189,248,0.4)] text-rose-100'
  };

  const glowStyle = phaseGlows[currentPhase];

  return (
    <div 
      onClick={() => triggerPulseAnimation()}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white selection:bg-white/10 font-sans relative overflow-hidden select-none cursor-pointer"
      title="Click to trigger cosmic pulse animation"
    >
      {/* Space Theme Background synced with real-world Day/Night cycle */}
      <SpaceBackground currentPhase={currentPhase} />

      {/* Cosmic shockwave ring */}
      {isAnimating && <div className="shockwave-ring z-10" />}

      {/* Main Timer Display - Synced 24h Countdown with Day/Night visual aura */}
      <div className={`relative z-10 flex items-center justify-center gap-2 md:gap-6 tabular-nums transition-all duration-1000 ${isAnimating ? 'animate-nine-start' : ''}`}>
        <TimeBlock value={hStr} label="HOURS" glowClass={glowStyle} />
        <Separator glowClass={glowStyle} />
        <TimeBlock value={mStr} label="MINUTES" glowClass={glowStyle} />
        <Separator glowClass={glowStyle} />
        <TimeBlock value={sStr} label="SECONDS" glowClass={glowStyle} />
      </div>
    </div>
  );
}

function TimeBlock({ value, label, glowClass }: { value: string, label: string, glowClass: string }) {
  return (
    <div className="flex flex-col items-center relative">
      <div className={`flex justify-center min-w-[1.4em] font-orbitron font-bold tabular-nums text-[7rem] md:text-[12rem] lg:text-[16rem] leading-none tracking-tight transition-all duration-1000 ${glowClass}`}>
        {value}
      </div>
      <div className="absolute top-full mt-2 md:mt-6 text-[10px] md:text-sm font-semibold tracking-[0.4em] text-white/40 uppercase font-sans">
        {label}
      </div>
    </div>
  );
}

function Separator({ glowClass }: { glowClass: string }) {
  return (
    <div className={`text-[7rem] md:text-[12rem] lg:text-[16rem] font-orbitron font-bold leading-none -translate-y-2 md:-translate-y-6 transition-all duration-1000 ${glowClass}`}>
      :
    </div>
  );
}

export default App;
