import { useEffect } from 'react';
import { X, Square, Mic } from 'lucide-react';
import { useVoiceRecorder } from '../../../shared/hooks/useVoiceRecorder';
import { useTranslation } from '../../../i18n';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VoiceOverlay({ isOpen, onClose, onTranscript }) {
  const { status, duration, transcript, start, stop, cancel, reset } =
    useVoiceRecorder();
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      start();
    } else {
      reset();
    }
  }, [isOpen, start, reset]);

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
      className="fixed inset-0 z-[90] bg-surface flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={t('chat.startVoice')}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={handleCancel}
          aria-label={t('chat.stopRecording')}
          className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
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

          {status === 'recording' && (
            <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          )}
        </div>

        <p className="text-lg font-semibold text-text-primary mb-2">
          {status === 'recording' && t('chat.listening')}
          {status === 'processing' && t('chat.processing')}
          {status === 'idle' && t('chat.ready')}
        </p>

        {status === 'recording' && (
          <p className="text-sm text-text-secondary tabular-nums mb-6">
            {formatDuration(duration)}
          </p>
        )}

        {transcript && (
          <div className="max-w-md text-center px-4 py-3 bg-page-bg rounded-card border border-border">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
              {t('chat.youSaid')}
            </p>
            <p className="text-sm text-text-primary italic">"{transcript}"</p>
          </div>
        )}

        {!transcript && status === 'recording' && (
          <p className="text-sm text-text-secondary italic">{t('chat.speakNow')}</p>
        )}
      </div>

      <div className="flex justify-center pb-12">
        <button
          onClick={handleStop}
          disabled={status !== 'recording'}
          aria-label={t('chat.stopRecording')}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square size={22} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

export default VoiceOverlay;