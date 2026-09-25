import { useEffect } from 'react';
import { X, Square, Mic } from 'lucide-react';
import { useVoiceRecorder } from '../../../shared/hooks/useVoiceRecorder';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VoiceOverlay({ isOpen, onClose, onTranscript }) {
  const { status, duration, transcript, start, stop, cancel, reset } =
    useVoiceRecorder();

  // Auto-start recording when overlay opens
  useEffect(() => {
    if (isOpen) {
      start();
    } else {
      reset();
    }
  }, [isOpen, start, reset]);

  // Escape key closes (cancels recording)
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        cancel();
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, cancel, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleStop = () => {
    stop();

    // Mock: send transcript after processing delay
    setTimeout(() => {
      if (transcript) {
        onTranscript(transcript);
      }
      reset();
      onClose();
    }, 700);
  };

  const handleCancel = () => {
    cancel();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-white flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Voice input"
    >
      {/* Top: Cancel */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleCancel}
          aria-label="Cancel voice input"
          className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      {/* Center: Waveform + status + transcript */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        {/* Waveform visualization */}
        <div className="relative mb-12">
          <div className="w-40 h-40 rounded-full bg-primary-light flex items-center justify-center">
            {status === 'recording' ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 bg-primary rounded-full animate-wave"
                    style={{
                      height: `${20 + (i % 3) * 12}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ) : status === 'processing' ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            ) : (
              <Mic size={48} className="text-primary" />
            )}
          </div>

          {/* Pulse ring while recording */}
          {status === 'recording' && (
            <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          )}
        </div>

        {/* Status text */}
        <p className="text-lg font-semibold text-text-primary mb-2">
          {status === 'recording' && 'Listening...'}
          {status === 'processing' && 'Processing...'}
          {status === 'idle' && 'Ready'}
        </p>

        {/* Duration */}
        {status === 'recording' && (
          <p className="text-sm text-text-secondary tabular-nums mb-6">
            {formatDuration(duration)}
          </p>
        )}

        {/* Live transcript */}
        {transcript && (
          <div className="max-w-md text-center px-4 py-3 bg-page-bg rounded-card border border-border">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
              You said
            </p>
            <p className="text-sm text-text-primary italic">
              "{transcript}"
            </p>
          </div>
        )}

        {!transcript && status === 'recording' && (
          <p className="text-sm text-text-secondary italic">
            Speak now in Amharic or English...
          </p>
        )}
      </div>

      {/* Bottom: Stop button */}
      <div className="flex justify-center pb-12">
        <button
          onClick={handleStop}
          disabled={status !== 'recording'}
          aria-label="Stop recording"
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square size={22} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

export default VoiceOverlay;