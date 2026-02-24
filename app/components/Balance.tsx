interface BalanceProps {
  balance: number;
  animClass?: string;
}

export default function Balance({ balance, animClass = '' }: BalanceProps) {
  return (
    <div className="bg-gradient-to-b from-blue-950 to-slate-900 p-5 rounded-xl mb-6 border-2 border-slate-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
      <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Your Salary</div>
      <div className={`text-5xl sm:text-4xl font-bold transition-all duration-300 ${
        balance < 0 
          ? 'text-red-400' 
          : 'text-green-400'
      } ${animClass === 'win' ? 'text-yellow-400 animate-pulse' : ''} ${
        animClass === 'lose' ? 'animate-shake' : ''
      }`}
      style={{
        textShadow: balance < 0 ? '0 0 10px rgba(248,113,113,0.7)' : '0 0 10px rgba(74,222,128,0.5)'
      }}>
        ${balance}
      </div>
    </div>
  );
}