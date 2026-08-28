import { useState, useEffect } from 'react';
import { SpaceBackground } from './SpaceBackground';

function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);

  // Trigger function for 9 AM start animation
  const trigger9AMStart = () => {
    setHasStarted(true);
    setIsAnimating(true);
    // Start at 9 hours (09:00:00)
    setSeconds(9 * 3600);
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = now.getHours();

      if (!hasStarted) {
        // Auto start if current time is 9 AM or later today
        if (h >= 9) {
          trigger9AMStart();
        }
      } else {
        // Tick timer after 9 AM start
        setSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted]);

  // Format hours, minutes, seconds zero-padded
  const displaySecs = hasStarted ? seconds : 0;
  const hStr = Math.floor(displaySecs / 3600).toString().padStart(2, '0');
  const mStr = Math.floor((displaySecs % 3600) / 60).toString().padStart(2, '0');
  const sStr = (displaySecs % 60).toString().padStart(2, '0');

  return (
    <div 
      onClick={() => { if (!hasStarted) trigger9AMStart(); }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white selection:bg-white/10 font-sans relative overflow-hidden select-none cursor-pointer"
      title={!hasStarted ? "Click to trigger 9 AM start animation" : ""}
    >
      {/* Space Theme Background */}
      <SpaceBackground />

      {/* Cosmic shockwave ring on 9 AM start */}
      {isAnimating && <div className="shockwave-ring z-10" />}

      {/* Main Timer Display - Pure numbers */}
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
