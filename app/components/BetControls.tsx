import Button from './Button';

interface BetControlsProps {
  bet: number;
  onAdjustBet: (amount: number) => void;
  disabled?: boolean;
}

export default function BetControls({ bet, onAdjustBet, disabled = false }: BetControlsProps) {
  return (
    <div className="mb-6">
      <div className="text-gray-300 text-base uppercase tracking-wider mb-3">Bet Amount</div>
      <div className="flex items-center justify-center gap-4">
        <Button 
          variant="secondary" 
          onClick={() => onAdjustBet(-100)}
          disabled={disabled}
        >
          −
        </Button>
        <span className="text-yellow-400 text-3xl font-bold min-w-[100px] sm:min-w-[80px]">${bet}</span>
        <Button 
          variant="secondary" 
          onClick={() => onAdjustBet(100)}
          disabled={disabled}
        >
          +
        </Button>
      </div>
    </div>
  );
}