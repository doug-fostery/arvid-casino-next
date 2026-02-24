'use client';

import { useState, useEffect, useRef } from 'react';
import { Symbol, SYMBOLS, SYMBOL_WEIGHTS, MULTIPLIERS } from '../lib/types';

interface SlotMachineProps {
  spinning: boolean;
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
  const [finalSymbols, setFinalSymbols] = useState<Symbol[]>(['🍒', '🍒', '🍒']);
  const [winnerSlots, setWinnerSlots] = useState<boolean[]>([false, false, false]);
  const [stoppedCount, setStoppedCount] = useState(0);
  const spinRef = useRef<number | null>(null);

  useEffect(() => {
    if (!spinning) {
      return;
    }

    // Reset state for new spin
    setWinnerSlots([false, false, false]);
    setStoppedCount(0);
    setFinalSymbols(['🍒', '🍒', '🍒']);
    playSpinSound();

    // Fast spin phase - 12 spins at 60ms
    let fastSpins = 0;
    const maxFastSpins = 12;

    const fastSpin = () => {
      setSymbols([getSymbol(), getSymbol(), getSymbol()]);
      playSpinSound();
      fastSpins++;

      if (fastSpins >= maxFastSpins) {
        // Start slowing phase - determine final symbols
        const final = [getSymbol(), getSymbol(), getSymbol()];
        setFinalSymbols(final);
        startStagger(final);
      } else {
        spinRef.current = window.setTimeout(fastSpin, 60);
      }
    };

    fastSpin();

    return () => {
      if (spinRef.current) clearTimeout(spinRef.current);
    };
  }, [spinning, playSpinSound]);

  const startStagger = (final: Symbol[]) => {
    // Slot 0 stops at ~400ms
    setTimeout(() => {
      setStoppedCount(1);
      setSymbols(prev => [final[0], prev[1], prev[2]]);
      playSpinSound();
    }, 400);

    // Slot 1 stops at ~750ms
    setTimeout(() => {
      setStoppedCount(2);
      setSymbols(prev => [prev[0], final[1], prev[2]]);
      playSpinSound();
    }, 750);

    // Slot 2 stops at ~1100ms - then determine result
    setTimeout(() => {
      setStoppedCount(3);
      setSymbols(prev => [prev[0], prev[1], final[2]]);
      playSpinSound();
      
      // Determine result after all stopped
      setTimeout(() => determineResult(final), 100);
    }, 1100);
  };

  const determineResult = (final: Symbol[]) => {
    const [a, b, c] = final;

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
      onWin(1, false);
      playWinSound();
      setTimeout(() => setWinnerSlots([false, false, false]), 1000);
      return;
    }

    // No match - lose
    onLose();
    playLoseSound();
  };

  const getSlotClass = (index: number) => {
    const isStopped = stoppedCount > index;
    const isWinner = winnerSlots[index];
    
    const base = 'bg-gradient-to-b from-gray-100 via-gray-200 to-white w-[90px] sm:w-[65px] h-[110px] sm:h-[80px] rounded-xl flex items-center justify-center text-5xl sm:text-3xl border-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.3)] relative overflow-hidden';
    
    if (isWinner) {
      return `${base} animate-winner-glow border-yellow-400`;
    }
    if (spinning && !isStopped) {
      return `${base} animate-pulse`;
    }
    return base;
  };

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-5 sm:p-3 rounded-2xl mb-6 border-3 border-gray-500 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_5px_20px_rgba(0,0,0,0.3)]">
      <div className="flex justify-center gap-3 sm:gap-2">
        {symbols.map((symbol, i) => (
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