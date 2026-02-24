'use client';

import { useState } from 'react';
import SlotMachine from './SlotMachine';
import { useAudio } from '../hooks/useAudio';
import { ARVID_QUOTES } from '../lib/quotes';
import { INITIAL_BALANCE, MIN_BET, BET_STEP } from '../lib/types';

export default function Casino() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [bet, setBet] = useState(MIN_BET);
  const [totalSpins, setTotalSpins] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState({ text: 'Place your bet!', type: 'neutral' as 'neutral' | 'win' | 'lose' });
  const [arvidMsg, setArvidMsg] = useState(ARVID_QUOTES[0]);
  const [balanceAnim, setBalanceAnim] = useState('');

  const { soundEnabled, toggleSound, playSpinSound, playWinSound, playLoseSound, playClickSound, initAudio } = useAudio();

  const handleSpin = () => {
    initAudio();
    playClickSound();
    
    if (balance < bet) {
      setResult({ text: 'Insufficient funds! Ask Arvid for a loan 😅', type: 'lose' });
      playLoseSound();
      return;
    }

    setSpinning(true);
    setBalance(prev => prev - bet);
    setTotalSpins(prev => prev + 1);
    setResult({ text: '🎰 Spinning... 🎰', type: 'neutral' });
  };

  const handleWin = (multiplier: number, isJackpot: boolean) => {
    const win = bet * multiplier;
    setBalance(prev => prev + win);
    setTotalWins(prev => prev + 1);
    setSpinning(false);
    setResult({ 
      text: isJackpot 
        ? `🎉 JACKPOT! $${win}! 🎉` 
        : multiplier === 1 
          ? `⭐ Small win! $${win} back ⭐`
          : `🎉 YOU WIN $${win}! 🎉`, 
      type: 'win' 
    });
    setBalanceAnim('win');
    setTimeout(() => setBalanceAnim(''), 2000);
    randomQuote();
  };

  const handleLose = () => {
    setSpinning(false);
    setResult({ text: `💸 You lost $${bet}`, type: 'lose' });
    setBalanceAnim('lose');
    setTimeout(() => setBalanceAnim(''), 500);
    randomQuote();
  };

  const randomQuote = () => {
    setArvidMsg(ARVID_QUOTES[Math.floor(Math.random() * ARVID_QUOTES.length)]);
  };

  const adjustBet = (amount: number) => {
    if (spinning) return;
    initAudio();
    playClickSound();
    setBet(prev => Math.max(MIN_BET, prev + amount));
  };

  return (
    <div className="bg-gradient-casino p-8 sm:p-5 rounded-2xl max-w-md w-full text-center border-4 border-yellow-400 shadow-casino relative container-trim">
      <h1 className="text-3xl sm:text-2xl text-yellow-400 text-shadow-gold animate-glow mb-2 tracking-widest">🎰 Arvid's Salary Casino 🎰</h1>
      <p className="text-gray-400 mb-6 text-sm italic">Win back your salary (probably not)</p>
      
      <div className="bg-gradient-balance p-5 rounded-xl mb-6 border-2 border-slate-700 shadow-balance">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Your Salary</div>
        <div className={`text-4xl sm:text-3xl font-bold transition-all duration-300 ${balance < 0 ? 'text-red-400 text-shadow-red animate-shake' : 'text-green-400 text-shadow-green'} ${balanceAnim === 'win' ? 'text-yellow-400 text-shadow-win animate-winPulse' : ''}`}>
          ${balance}
        </div>
      </div>
      
      <SlotMachine
        spinning={spinning}
        onSpinStart={() => setSpinning(true)}
        onWin={handleWin}
        onLose={handleLose}
        playSpinSound={playSpinSound}
        playWinSound={playWinSound}
        playLoseSound={playLoseSound}
      />
      
      <div className="mb-5">
        <div className="text-gray-300 text-sm uppercase tracking-wider mb-3">Bet Amount</div>
        <div className="flex items-center justify-center gap-4">
          <button 
            className="w-12 h-12 sm:w-11 sm:h-11 rounded-full bg-gradient-btn text-white text-2xl shadow-btn hover:scale-110 active:scale-95 transition-transform" 
            onClick={() => adjustBet(-BET_STEP)}
            disabled={spinning}
          >−</button>
          <span className="text-yellow-400 text-2xl font-bold min-w-[80px] sm:min-w-[60px]">${bet}</span>
          <button 
            className="w-12 h-12 sm:w-11 sm:h-11 rounded-full bg-gradient-btn text-white text-2xl shadow-btn hover:scale-110 active:scale-95 transition-transform" 
            onClick={() => adjustBet(BET_STEP)}
            disabled={spinning}
          >+</button>
        </div>
      </div>
      
      <button 
        className="w-full py-5 bg-gradient-spin text-white text-xl font-bold uppercase tracking-widest rounded-xl shadow-spin-btn hover:translate-y-[-2px] hover:shadow-[0_8px_0_#c73e54,0_14px_25px_rgba(233,69,96,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#c73e54,0_4px_10px_rgba(233,69,96,0.4)] transition-all relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-shimmer disabled:opacity-60 disabled:cursor-not-allowed" 
        onClick={handleSpin}
        disabled={spinning}
      >
        🎲 SPIN! 🎲
      </button>
      
      <div className={`mt-6 p-5 rounded-xl text-lg font-bold uppercase tracking-wider min-h-[64px] sm:min-h-[48px] flex items-center justify-center ${result.type === 'win' ? 'result-win text-green-400 border-2 border-green-400' : result.type === 'lose' ? 'result-lose text-red-400 border-2 border-red-400' : 'result-neutral text-gray-400 border-2 border-slate-600'}`}>
        {result.text}
      </div>
      
      <div className="mt-6 bg-gradient-arvid p-4 rounded-xl text-purple-300 text-sm italic border border-purple-900">
        {arvidMsg}
      </div>
      
      <div className="mt-5 flex justify-around text-gray-500 text-sm font-mono">
        <span>Spins: <span id="totalSpins">{totalSpins}</span></span>
        <span>Wins: <span id="totalWins">{totalWins}</span></span>
      </div>
      
      <button 
        className={`fixed top-5 right-5 sm:top-3 sm:right-3 bg-gray-700 border-2 border-gray-500 rounded-lg p-2 text-xl cursor-pointer z-50 ${soundEnabled ? 'border-green-400 text-green-400' : ''}`} 
        onClick={toggleSound}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
}