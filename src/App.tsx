import { useState, useEffect } from 'react';
import { SpaceBackground } from './SpaceBackground';

// Anchor Date: 18th August 2026 at 08:00:00 AM local time
const ANCHOR_START = new Date(2026, 7, 18, 8, 0, 0); // Month 7 = August in JS Date
const DAY_SECONDS = 24 * 60 * 60; // 86,400 seconds in 24 hours

function App() {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(DAY_SECONDS);

  // Trigger cosmic shockwave animation
  const triggerPulseAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  useEffect(() => {
    const updateSyncTimer = () => {
      const now = new Date();
      const totalElapsedSecs = Math.floor((now.getTime() - ANCHOR_START.getTime()) / 1000);

      if (totalElapsedSecs < 0) {
        // If current time is prior to Aug 18 8:00 AM
        setRemainingSeconds(DAY_SECONDS);
        return;
      }

      // Elapsed seconds in current 24-hour cycle (0..86399)
      const elapsedInCycle = totalElapsedSecs % DAY_SECONDS;
      const remaining = DAY_SECONDS - elapsedInCycle;

      // Trigger animation at 8:00:00 AM cycle start
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
  const hStr = Math.floor(remainingSeconds / 3600).toString().padStart(2, '0');
  const mStr = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0');
  const sStr = (remainingSeconds % 60).toString().padStart(2, '0');

  return (
    <div 
      onClick={() => triggerPulseAnimation()}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white selection:bg-white/10 font-sans relative overflow-hidden select-none cursor-pointer"
      title="Click to trigger cosmic shockwave animation"
    >
      {/* Space Theme Background */}
      <SpaceBackground />

      {/* Cosmic shockwave ring */}
      {isAnimating && <div className="shockwave-ring z-10" />}

      {/* Main Timer Display - Synced 24h Countdown */}
      <div className={`relative z-10 flex items-center justify-center gap-2 md:gap-6 tabular-nums ${isAnimating ? 'animate-nine-start' : ''}`}>
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
      <div className="flex justify-center min-w-[1.4em] font-orbitron font-bold tabular-nums text-[7rem] md:text-[12rem] lg:text-[16rem] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] leading-none tracking-tight">
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
    <div className="text-[7rem] md:text-[12rem] lg:text-[16rem] font-orbitron font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] leading-none -translate-y-2 md:-translate-y-6">
      :
    </div>
  );
}

export default App;
