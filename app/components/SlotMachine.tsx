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
  const [slotStates, setSlotStates] = useState<('spinning' | 'slowing' | 'stopped')[]>(['stopped', 'stopped', 'stopped']);

  useEffect(() => {
    if (!spinning) return;

    // Reset states
    setSlotStates(['spinning', 'spinning', 'spinning']);
    playSpinSound();

    let spins = 0;
    const maxFastSpins = 15; // Fast spinning phase
    const slowSpins = 10; // Slowing down phase
    
    const interval = setInterval(() => {
      setSymbols([getSymbol(), getSymbol(), getSymbol()]);
      
      // Stagger the slowing down
      if (spins >= maxFastSpins) {
        const slowingPhase = spins - maxFastSpins;
        
        setSlotStates(prev => {
          const newStates = [...prev];
          if (slowingPhase >= 0 && newStates[0] === 'spinning') newStates[0] = 'slowing';
          if (slowingPhase >= 3 && newStates[1] === 'spinning') newStates[1] = 'slowing';
          if (slowingPhase >= 6 && newStates[2] === 'spinning') newStates[2] = 'slowing';
          return newStates;
        });
      }
      
      playSpinSound();
      spins++;
      
      if (spins >= maxFastSpins + slowSpins) {
        clearInterval(interval);
        
        // Stop slots one by one with delay
        setSlotStates(['slowing', 'spinning', 'spinning']);
        setSymbols(prev => [prev[0], getSymbol(), getSymbol()]);
        
        setTimeout(() => {
          setSlotStates(['stopped', 'slowing', 'spinning']);
          setSymbols(prev => [...prev.slice(0, 1), getSymbol(), prev[2]]);
          
          setTimeout(() => {
            setSlotStates(['stopped', 'stopped', 'slowing']);
            setSymbols(prev => [...prev.slice(0, 2), getSymbol()]);
            
            setTimeout(() => {
              setSlotStates(['stopped', 'stopped', 'stopped']);
              finalizeSpin();
            }, 400);
          }, 400);
        }, 400);
      }
    }, 120);

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

  const getSlotClass = (index: number) => {
    const base = 'bg-gradient-to-b from-gray-100 via-gray-200 to-white w-[90px] sm:w-[65px] h-[110px] sm:h-[80px] rounded-xl flex items-center justify-center text-5xl sm:text-3xl border-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.3)] relative overflow-hidden';
    const state = slotStates[index];
    const winner = winnerSlots[index];
    
    let animation = '';
    if (state === 'spinning') animation = 'animate-spin-blur';
    if (state === 'slowing') animation = 'animate-slow-spin';
    if (winner) animation = 'animate-winner-glow border-yellow-400';
    
    return `${base} ${animation}`;
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
            {/* Slot shine effect */}
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