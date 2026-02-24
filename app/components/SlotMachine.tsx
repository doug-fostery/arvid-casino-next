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

  useEffect(() => {
    if (!spinning) return;

    const slotEls = [
      document.getElementById('slot1'),
      document.getElementById('slot2'),
      document.getElementById('slot3')
    ];
    slotEls.forEach(el => el?.classList.add('animate-slotBlur'));
    playSpinSound();

    let spins = 0;
    const maxSpins = 25;
    
    const interval = setInterval(() => {
      setSymbols([getSymbol(), getSymbol(), getSymbol()]);
      playSpinSound();
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        slotEls.forEach(el => el?.classList.remove('animate-slotBlur'));
        finalizeSpin();
      }
    }, 80);

    return () => clearInterval(interval);
  }, [spinning, playSpinSound]);

  const finalizeSpin = () => {
    const finalSymbols: Symbol[] = [getSymbol(), getSymbol(), getSymbol()];
    setSymbols(finalSymbols);

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

  return (
    <div className="bg-gradient-slots p-5 sm:p-3 rounded-2xl mb-6 border-3 border-gray-500 shadow-slots-container">
      <div className="flex justify-center gap-3 sm:gap-2">
        {symbols.map((symbol, i) => (
          <div 
            key={i} 
            id={`slot${i + 1}`}
            className={`bg-gradient-slot w-[90px] sm:w-[65px] h-[110px] sm:h-[80px] rounded-xl flex items-center justify-content-center text-5xl sm:text-3xl border-4 border-gray-700 shadow-slot relative overflow-hidden slot-shine ${winnerSlots[i] ? 'animate-winnerGlow border-yellow-400' : ''}`}
          >
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