# Slot Machine Specification

## Symbols
- Fruit: 🍒, 🍋, 🍊, 🍇 (weight: 30, 25, 20, 15)
- Special: 💎 (weight: 7) 
- Jackpot: 7️⃣ (weight: 3)

## Payouts
- 3x for 3 matching fruit (🍒🍒🍒, 🍋🍋🍋, etc.)
- 5x for 3 💎 (💎💎💎)
- 10x for 3 7️⃣ (JACKPOT)
- 1x for 2 matching symbols (small win)

## Win Detection Logic
```
1. Get final symbols: [A, B, C]
2. Check allSame: A === B && B === C
   - If true, determine multiplier based on symbol
3. If not allSame, check twoSame: (A === B) || (B === C) || (A === C)
   - If true, small win (1x)
4. Otherwise, lose
```

## Animation Phases
1. **Fast Spin** (~600ms): Symbols change rapidly every 60ms
2. **Slowing Phase**: Each slot slows down and stops one at a time
   - Slot 0 stops at T+1000ms with its FINAL symbol
   - Slot 1 stops at T+1350ms with its FINAL symbol  
   - Slot 2 stops at T+1700ms with its FINAL symbol
3. **Result Phase**: After all slots stop, show win/lose

## Visual States
- spinning: Fast animation
- slowing: Pulsing animation
- stopped: Static with winner glow if applicable
- winner: Golden glow animation + confetti
