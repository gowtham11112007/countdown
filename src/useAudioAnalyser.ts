import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Captures microphone input and drives the playbackRate of all
 * `.audio-speed` CSS animations based on bass energy.
 *
 * No shape / scale / filter changes — only speed.
 * Uses Web Animations API playbackRate for smooth, jump-free speed control.
 */
export function useAudioAnalyser() {
  const [isActive, setIsActive] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef(0);

  // Adaptive peak tracking — slowly decays so quiet passages still register
  const peakRef = useRef({ bass: 0.01, mid: 0.01, treble: 0.01, vol: 0.01 });

  // Cached Animation objects (queried once, separated for different reactivity)
  const particleAnimsRef = useRef<Animation[] | null>(null);
  const cloudAnimsRef = useRef<Animation[] | null>(null);

  // Smoothed playback rate to prevent jitter
  const smoothRateRef = useRef(1);

  const loop = useCallback(() => {
    const analyser = analyserRef.current;
    const buf = bufRef.current;
    if (!analyser || !buf) return;

    analyser.getByteFrequencyData(buf);

    const len = buf.length; // 128 bins (fftSize 256)
    const root = document.documentElement.style;
    const pk = peakRef.current;

    // ── Band energies (raw 0-1) ──
    let bS = 0;
    for (let i = 1; i <= 6; i++) bS += buf[i];         // ~86-516 Hz
    let mS = 0;
    for (let i = 7; i <= 30; i++) mS += buf[i];         // ~600-2580 Hz
    let tS = 0;
    const tEnd = Math.min(80, len);
    for (let i = 31; i < tEnd; i++) tS += buf[i];       // ~2666-6880 Hz
    let vS = 0;
    for (let i = 0; i < len; i++) vS += buf[i];

    const rawBass = bS / (6 * 255);
    const rawMid = mS / (24 * 255);
    const rawTreble = tS / (Math.max(1, tEnd - 31) * 255);
    const rawVol = vS / (len * 255);

    // ── Adaptive peak (fast attack, slow decay) ──
    pk.bass = Math.max(pk.bass * 0.997, rawBass, 0.01);
    pk.mid = Math.max(pk.mid * 0.997, rawMid, 0.01);
    pk.treble = Math.max(pk.treble * 0.997, rawTreble, 0.01);
    pk.vol = Math.max(pk.vol * 0.997, rawVol, 0.01);

    // ── Normalized 0-1 ──
    const bass = Math.min(1, rawBass / pk.bass);
    const volume = Math.min(1, rawVol / pk.vol);

    // ── Write to CSS (kept for potential future use) ──
    root.setProperty('--audio-bass', bass.toFixed(4));
    root.setProperty('--audio-mid', (rawMid / pk.mid).toFixed(4));
    root.setProperty('--audio-treble', (rawTreble / pk.treble).toFixed(4));
    root.setProperty('--audio-volume', volume.toFixed(4));

    // ── Cache animations (once) ──
    if (!particleAnimsRef.current) {
      const els = document.querySelectorAll('.audio-particle');
      if (els.length > 0) {
        const anims: Animation[] = [];
        els.forEach(el => el.getAnimations().forEach(a => anims.push(a)));
        if (anims.length > 0) particleAnimsRef.current = anims;
      }
    }
    if (!cloudAnimsRef.current) {
      const els = document.querySelectorAll('.audio-cloud');
      if (els.length > 0) {
        const anims: Animation[] = [];
        els.forEach(el => el.getAnimations().forEach(a => anims.push(a)));
        if (anims.length > 0) cloudAnimsRef.current = anims;
      }
    }

    // ── Drive animation speeds ──
    const energy = Math.max(bass, volume);

    // Particles: aggressive exponential curve → 1× to 10×
    if (particleAnimsRef.current) {
      const targetRate = 1 + Math.pow(energy, 1.5) * 9;
      smoothRateRef.current = smoothRateRef.current * 0.55 + targetRate * 0.45;
      for (const a of particleAnimsRef.current) a.playbackRate = smoothRateRef.current;
    }

    // Clouds: gentler → 1× to 3×
    if (cloudAnimsRef.current) {
      const cloudRate = 1 + energy * 2;
      for (const a of cloudAnimsRef.current) a.playbackRate = cloudRate;
    }

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const initAudio = useCallback(async () => {
    if (ctxRef.current) return; // already running

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      // intentionally NOT connecting to ctx.destination — no playback

      ctxRef.current = ctx;
      analyserRef.current = analyser;
      bufRef.current = new Uint8Array(analyser.frequencyBinCount);

      setIsActive(true);
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      console.warn('Microphone access denied:', err);
    }
  }, [loop]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      ctxRef.current?.close();
    };
  }, []);

  return { isActive, initAudio };
}
