import { useState, useEffect } from 'react';
import { Play, Pause, Square, Settings } from 'lucide-react';
import { SpaceBackground } from './SpaceBackground';

function App() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(24 * 60 * 60);
  };
  
  const setTime = (hours: number) => {
    setIsRunning(false);
    setTimeLeft(hours * 60 * 60);
  }

  // Format with zero-padding
  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white selection:bg-white/10 font-sans relative overflow-hidden transition-colors duration-1000">
      
      {/* Space Theme Background */}
      <SpaceBackground />

      {/* Main Timer Display */}
      <div className="relative z-10 flex items-center justify-center gap-2 md:gap-6 tabular-nums">
        <TimeBlock value={h} label="HOURS" />
        <Separator />
        <TimeBlock value={m} label="MINUTES" />
        <Separator />
        <TimeBlock value={s} label="SECONDS" />
      </div>

      {/* Controls Container - Hover to reveal */}
      <div className="absolute bottom-12 group z-20">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-6">
          
          <div className="flex gap-4">
            <ControlButton onClick={isRunning ? handlePause : handleStart}>
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </ControlButton>
            <ControlButton onClick={handleReset}>
              <Square className="w-5 h-5" />
            </ControlButton>
            <ControlButton onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-5 h-5" />
            </ControlButton>
          </div>

          {showSettings && (
            <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl backdrop-blur-xl border border-white/10">
              <PresetButton onClick={() => setTime(24)}>24H</PresetButton>
              <PresetButton onClick={() => setTime(12)}>12H</PresetButton>
              <PresetButton onClick={() => setTime(1)}>1H</PresetButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: string, label: string }) {

  return (
    <div className="flex flex-col items-center relative">
      <div className="flex justify-center min-w-[1.4em] font-orbitron font-bold tabular-nums text-[7rem] md:text-[12rem] lg:text-[16rem] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] leading-none tracking-tight">
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
    <div className="text-[7rem] md:text-[12rem] lg:text-[16rem] font-orbitron font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] leading-none -translate-y-2 md:-translate-y-6">
      :
    </div>
  );
}

function ControlButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all duration-300 backdrop-blur-xl border border-white/5 hover:border-white/10"
    >
      {children}
    </button>
  );
}

function PresetButton({ children, onClick }: { children: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="px-5 py-2 text-xs font-bold tracking-widest text-white/50 hover:text-white bg-transparent hover:bg-white/10 rounded-lg transition-all duration-300"
    >
      {children}
    </button>
  );
}

export default App;
