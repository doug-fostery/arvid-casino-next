'use client';

import { useState } from 'react';
import SlotMachine from './SlotMachine';
import Button from './Button';
import Balance from './Balance';
import BetControls from './BetControls';
import Result from './Result';
import ArvidMessage from './ArvidMessage';
import Stats from './Stats';
import SoundToggle from './SoundToggle';
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
    <div className="bg-gradient-to-b from-indigo-950 to-slate-950 p-8 sm:p-5 rounded-2xl max-w-md w-full text-center border-4 border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.3),inset_0_0_60px_rgba(0,0,0,0.5)] relative before:content-[''] before:absolute before:top-2 before:left-2 before:right-2 before:bottom-2 before:border-2 before:border-yellow-400/50 before:rounded-[14px]">
      <h1 className="text-3xl sm:text-2xl text-yellow-400 mb-2 tracking-widest animate-glow" style={{ textShadow: '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ff8c00' }}>🎰 Arvid's Salary Casino 🎰</h1>
      <p className="text-gray-400 mb-6 text-sm italic">Win back your salary (probably not)</p>
      
      <Balance balance={balance} animClass={balanceAnim} />
      
      <SlotMachine
        spinning={spinning}
        onSpinStart={() => setSpinning(true)}
        onWin={handleWin}
        onLose={handleLose}
        playSpinSound={playSpinSound}
        playWinSound={playWinSound}
        playLoseSound={playLoseSound}
      />
      
      <BetControls bet={bet} onAdjustBet={adjustBet} disabled={spinning} />
      
      <Button 
        onClick={handleSpin}
        disabled={spinning}
        className="w-full py-5 text-xl uppercase tracking-widest"
      >
        🎲 SPIN! 🎲
      </Button>
      
      <Result text={result.text} type={result.type} />
      <ArvidMessage message={arvidMsg} />
      <Stats spins={totalSpins} wins={totalWins} />
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
    </div>
  );
}