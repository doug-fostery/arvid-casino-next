import Button from './Button';

interface BetControlsProps {
  bet: number;
  onAdjustBet: (amount: number) => void;
  disabled?: boolean;
}

export default function BetControls({ bet, onAdjustBet, disabled = false }: BetControlsProps) {
  return (
    <div className="mb-5">
      <div className="text-gray-300 text-sm uppercase tracking-wider mb-3">Bet Amount</div>
      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="secondary" 
          onClick={() => onAdjustBet(-100)}
          disabled={disabled}
          className="w-12 h-12 sm:w-11 sm:h-11 text-2xl"
        >
          −
        </Button>
        <span className="text-yellow-400 text-2xl font-bold min-w-[80px] sm:min-w-[60px]">${bet}</span>
        <Button 
          variant="secondary" 
          onClick={() => onAdjustBet(100)}
          disabled={disabled}
          className="w-12 h-12 sm:w-11 sm:h-11 text-2xl"
        >
          +
        </Button>
      </div>
    </div>
  );
}