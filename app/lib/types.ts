export interface GameState {
  balance: number;
  bet: number;
  totalSpins: number;
  totalWins: number;
  spinning: boolean;
}

export type Symbol = '🍒' | '🍋' | '🍊' | '🍇' | '💎' | '7️⃣';

export const SYMBOLS: Symbol[] = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];

export const SYMBOL_WEIGHTS = [30, 25, 20, 15, 7, 3];

export const MULTIPLIERS: Record<Symbol, number> = {
  '🍒': 3,
  '🍋': 3,
  '🍊': 3,
  '🍇': 3,
  '💎': 5,
  '7️⃣': 10,
};

export const INITIAL_BALANCE = 1000;
export const MIN_BET = 100;
export const BET_STEP = 100;