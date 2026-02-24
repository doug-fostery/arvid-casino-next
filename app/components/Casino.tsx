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
    <div className="container">
      <h1>🎰 Arvid's Salary Casino 🎰</h1>
      <p className="subtitle">Win back your salary (probably not)</p>
      
      <div className="balance">
        <div className="balance-label">Your Salary</div>
        <div className={`balance-amount ${balance < 0 ? 'negative' : ''} ${balanceAnim}`}>
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
      
      <div className="bet-controls">
        <div className="bet-label">Bet Amount</div>
        <div className="bet-input">
          <button className="bet-btn" onClick={() => adjustBet(-BET_STEP)}>−</button>
          <span className="bet-amount">${bet}</span>
          <button className="bet-btn" onClick={() => adjustBet(BET_STEP)}>+</button>
        </div>
      </div>
      
      <button 
        className="spin-btn" 
        onClick={handleSpin}
        disabled={spinning}
      >
        🎲 SPIN! 🎲
      </button>
      
      <div className={`result ${result.type}`}>
        {result.text}
      </div>
      
      <div className="arvid-msg">
        {arvidMsg}
      </div>
      
      <div className="stats">
        <span>Spins: <span id="totalSpins">{totalSpins}</span></span>
        <span>Wins: <span id="totalWins">{totalWins}</span></span>
      </div>
      
      <button 
        className={`sound-toggle ${soundEnabled ? 'on' : ''}`} 
        onClick={toggleSound}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
}