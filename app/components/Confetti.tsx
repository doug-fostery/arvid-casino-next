'use client';

import { useState, useEffect } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
  symbol: string;
}

interface ConfettiProps {
  active: boolean;
}

export default function Confetti({ active }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['🎰', '💎', '🎉', '⭐', '🍒', '💰', '🏆'];
      const newPieces = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        symbol: Math.random() > 0.5 ? '✨' : ''
      }));
      setPieces(newPieces);
      
      // Clear confetti after animation
      const timer = setTimeout(() => setPieces([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti text-2xl"
          style={{
            left: `${piece.x}%`,
            bottom: '50%',
            animationDelay: `${piece.delay}s`,
          }}
        >
          {piece.color}
          {piece.symbol && <span className="absolute -right-1 -top-1">{piece.symbol}</span>}
        </div>
      ))}
    </div>
  );
}