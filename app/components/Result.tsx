interface ResultProps {
  text: string;
  type: 'neutral' | 'win' | 'lose';
}

export default function Result({ text, type }: ResultProps) {
  const styles = {
    neutral: 'bg-gradient-to-b from-slate-700 to-slate-900 text-gray-400 border-2 border-slate-600',
    win: 'bg-gradient-to-b from-green-900/30 to-green-900/10 text-green-400 border-2 border-green-400',
    lose: 'bg-gradient-to-b from-red-900/30 to-red-900/10 text-red-400 border-2 border-red-400'
  };

  return (
    <div className={`mt-6 p-5 rounded-xl text-lg font-bold uppercase tracking-wider min-h-[64px] sm:min-h-[48px] flex items-center justify-center ${styles[type]}`}>
      {text}
    </div>
  );
}