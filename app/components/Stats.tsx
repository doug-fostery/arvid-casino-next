interface StatsProps {
  spins: number;
  wins: number;
}

export default function Stats({ spins, wins }: StatsProps) {
  return (
    <div className="mt-5 flex justify-around text-gray-500 text-sm font-mono">
      <span>Spins: <span id="totalSpins">{spins}</span></span>
      <span>Wins: <span id="totalWins">{wins}</span></span>
    </div>
  );
}