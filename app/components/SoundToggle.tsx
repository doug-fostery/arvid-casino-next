interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button 
      onClick={onToggle}
      className={`fixed top-5 right-5 sm:top-3 sm:right-3 bg-gray-700 border-2 border-gray-500 rounded-lg p-2 text-xl cursor-pointer z-50 ${enabled ? 'border-green-400 text-green-400' : ''}`}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
}