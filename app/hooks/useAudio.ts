'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

interface AudioContextRef {
  current: AudioContext | null;
}

const audioCtxRef: AudioContextRef = { current: null };

export function useAudio() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const initAudio = useCallback(() => {
    if (initialized) {
      // Resume if suspended
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }
    
    try {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setInitialized(true);
    } catch (e) {
      console.log('Audio not supported:', e);
    }
  }, [initialized]);

  const playSound = useCallback((
    freq: number, 
    duration: number, 
    type: OscillatorType = 'square', 
    volume: number = 0.3
  ) => {
    if (!soundEnabled) return;
    
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Sound error:', e);
    }
  }, [soundEnabled]);

  const playSpinSound = useCallback(() => {
    playSound(300 + Math.random() * 100, 0.08, 'square', 0.2);
  }, [playSound]);

  const playWinSound = useCallback(() => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playSound(freq, 0.3, 'sine', 0.4), i * 150);
    });
  }, [playSound]);

  const playLoseSound = useCallback(() => {
    playSound(200, 0.4, 'sawtooth', 0.3);
    setTimeout(() => playSound(150, 0.4, 'sawtooth', 0.3), 250);
  }, [playSound]);

  const playClickSound = useCallback(() => {
    playSound(800, 0.05, 'sine', 0.3);
  }, [playSound]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
    playClickSound();
  }, [playClickSound]);

  // Initialize on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
    };
    
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
    
    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, [initAudio]);

  return {
    soundEnabled,
    toggleSound,
    playSpinSound,
    playWinSound,
    playLoseSound,
    playClickSound,
    initAudio,
  };
}