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
  onSpinStart,
  onWin,
  onLose,
  playSpinSound,
  playWinSound,
  playLoseSound,
}: SlotMachineProps) {
  const [symbols, setSymbols] = useState<Symbol[]>(['🍒', '🍒', '🍒']);
  const [winnerSlots, setWinnerSlots] = useState<boolean[]>([false, false, false]);
  const [stoppedSlots, setStoppedSlots] = useState<number[]>([]);

  useEffect(() => {
    if (!spinning) {
      setStoppedSlots([]);
      return;
    }

    setWinnerSlots([false, false, false]);
    playSpinSound();

    let spins = 0;
    const maxFastSpins = 12;
    
    // Fast spinning phase
    const fastInterval = setInterval(() => {
      setSymbols([getSymbol(), getSymbol(), getSymbol()]);
      playSpinSound();
      spins++;
      
      if (spins >= maxFastSpins) {
        clearInterval(fastInterval);
        // Start staggered stopping
        stopSlot(0);
      }
    }, 80);

    return () => clearInterval(fastInterval);
  }, [spinning, playSpinSound]);

  const stopSlot = (slotIndex: number) => {
    if (slotIndex >= 3) {
      // All slots stopped, determine winner
      finalizeSpin();
      return;
    }

    setStoppedSlots(prev => [...prev, slotIndex]);
    
    // Continue playing sound while stopping
    playSpinSound();
    
    setTimeout(() => {
      stopSlot(slotIndex + 1);
    }, 400);
  };

  const finalizeSpin = () => {
    const finalSymbols = symbols;
    const allSame = finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2];
    const twoSame = finalSymbols[0] === finalSymbols[1] || 
                    finalSymbols[1] === finalSymbols[2] || 
                    finalSymbols[0] === finalSymbols[2];

    if (allSame) {
      const isJackpot = finalSymbols[0] === '7️⃣';
      const multiplier = MULTIPLIERS[finalSymbols[0]];
      setWinnerSlots([true, true, true]);
      onWin(multiplier, isJackpot);
      playWinSound();
      setTimeout(() => setWinnerSlots([false, false, false]), 2000);
    } else if (twoSame) {
      setWinnerSlots([true, true, true]);
      onWin(1, false);
      playWinSound();
      setTimeout(() => setWinnerSlots([false, false, false]), 1000);
    } else {
      onLose();
      playLoseSound();
    }
  };

  const getSlotClass = (index: number) => {
    const isStopped = stoppedSlots.includes(index);
    const isWinner = winnerSlots[index];
    
    let base = 'bg-gradient-to-b from-gray-100 via-gray-200 to-white w-[90px] sm:w-[65px] h-[110px] sm:h-[80px] rounded-xl flex items-center justify-center text-5xl sm:text-3xl border-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.3)] relative overflow-hidden';
    
    if (isWinner) {
      base += ' animate-winner-glow border-yellow-400';
    } else if (!isStopped && spinning) {
      base += ' animate-pulse';
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