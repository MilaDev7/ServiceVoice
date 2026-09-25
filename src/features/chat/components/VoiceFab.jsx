import { Mic } from 'lucide-react';

function VoiceFab({ onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Start voice input"
      className="absolute bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-20"
    >
      <Mic size={22} />
    </button>
  );
}

export default VoiceFab;