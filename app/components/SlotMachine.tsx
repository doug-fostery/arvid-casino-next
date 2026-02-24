'use client';

import { useState, useEffect } from 'react';
import { Symbol, SYMBOLS, SYMBOL_WEIGHTS, MULTIPLIERS } from '../lib/types';

interface SlotMachineProps {
  spinning: boolean;
  onSpinStart: () => void;
  onWin: (multiplier: number, isJackpot: boolean) => void;
  onLose: () => void;
  playSpinSound: () => void;
  playWinSound: () => void;
  playLoseSound: () => void;
}

export default function SlotMachine({
  spinning,
  onWin,
  onLose,
  playSpinSound,
  playWinSound,
  playLoseSound,
}: SlotMachineProps) {
  const [symbols, setSymbols] = useState<Symbol[]>(['🍒', '🍒', '🍒']);
  const [stoppedSymbols, setStoppedSymbols] = useState<(Symbol | null)[]>([null, null, null]);
  const [winnerSlots, setWinnerSlots] = useState<boolean[]>([false, false, false]);
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'slowing' | 'stopped'>('idle');

  useEffect(() => {
    if (!spinning) {
      setPhase('idle');
      setStoppedSymbols([null, null, null]);
      setWinnerSlots([false, false, false]);
      return;
    }

    // Reset state
    setPhase('spinning');
    setStoppedSymbols([null, null, null]);
    setWinnerSlots([false, false, false]);
    playSpinSound();

    // Fast spin phase - 10 spins at 60ms each = 600ms
    let fastSpins = 0;
    const maxFastSpins = 10;

    const fastSpinInterval = setInterval(() => {
      setSymbols([getSymbol(), getSymbol(), getSymbol()]);
      playSpinSound();
      fastSpins++;

      if (fastSpins >= maxFastSpins) {
        clearInterval(fastSpinInterval);
        startSlowingPhase();
      }
    }, 60);

    return () => clearInterval(fastSpinInterval);
  }, [spinning, playSpinSound]);

  const startSlowingPhase = () => {
    setPhase('slowing');
    
    // Stop slot 0 at T+1000ms with final symbol
    setTimeout(() => {
      const final0 = getSymbol();
      setStoppedSymbols(prev => [final0, prev[1], prev[2]]);
      playSpinSound();
    }, 400);

    // Stop slot 1 at T+1350ms with final symbol
    setTimeout(() => {
      const final1 = getSymbol();
      setStoppedSymbols(prev => [prev[0], final1, prev[2]]);
      playSpinSound();
    }, 750);

    // Stop slot 2 at T+1700ms with final symbol
    setTimeout(() => {
      const final2 = getSymbol();
      setStoppedSymbols(prev => [prev[0], prev[1], final2]);
      playSpinSound();
      
      // All stopped - determine result
      setPhase('stopped');
      determineResult();
    }, 1100);
  };

  const determineResult = () => {
    const finalSymbols = stoppedSymbols;
    const [a, b, c] = finalSymbols;

    // Guard - if any slot hasn't finished, don't determine result
    if (a === null || b === null || c === null) return;

    // All three match
    if (a === b && b === c) {
      const multiplier = MULTIPLIERS[a];
      const isJackpot = a === '7️⃣';
      setWinnerSlots([true, true, true]);
      onWin(multiplier, isJackpot);
      playWinSound();
      setTimeout(() => setWinnerSlots([false, false, false]), 2000);
      return;
    }

    // Two match (small win)
    if (a === b || b === c || a === c) {
      setWinnerSlots([true, true, true]);
      onWin(1, false); // 1x payout
      playWinSound();
      setTimeout(() => setWinnerSlots([false, false, false]), 1000);
      return;
    }

    // No match - lose
    onLose();
    playLoseSound();
  };

  // Determine which symbols to display
  const displaySymbols = phase === 'idle' || phase === 'spinning' 
    ? symbols 
    : stoppedSymbols.map((s, i) => s || symbols[i]);

  const getSlotClass = (index: number) => {
    const isStopped = phase === 'stopped' || (phase === 'slowing' && stoppedSymbols[index] !== null);
    const isWinner = winnerSlots[index];
    
    const base = 'bg-gradient-to-b from-gray-100 via-gray-200 to-white w-[90px] sm:w-[65px] h-[110px] sm:h-[80px] rounded-xl flex items-center justify-center text-5xl sm:text-3xl border-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.3)] relative overflow-hidden';
    
    if (isWinner) {
      return `${base} animate-winner-glow border-yellow-400`;
    }
    if (phase === 'spinning') {
      return `${base} animate-pulse`;
    }
    if (phase === 'slowing' && !isStopped) {
      return `${base} animate-pulse`;
    }
    return base;
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-5 sm:p-3 rounded-2xl mb-6 border-3 border-gray-500 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_5px_20px_rgba(0,0,0,0.3)]">
      <div className="flex justify-center gap-3 sm:gap-2">
        {displaySymbols.map((symbol, i) => (
          <div 
            key={i} 
            id={`slot${i + 1}`}
            className={getSlotClass(i)}
          >
            <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-white/80 to-transparent pointer-events-none"></div>
            {symbol}
          </div>
        ))}
      </div>
    </div>
  );
}

function getSymbol(): Symbol {
  const total = SYMBOL_WEIGHTS.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < SYMBOLS.length; i++) {
    random -= SYMBOL_WEIGHTS[i];
    if (random <= 0) return SYMBOLS[i];
  }
  return SYMBOLS[0];
}