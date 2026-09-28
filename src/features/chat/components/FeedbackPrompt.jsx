import { useState } from 'react';
import { Mic, Square, Keyboard, MessageSquare } from 'lucide-react';
import Modal from '../../../shared/components/Modal';
import { useTranslation } from '../../../i18n';

function FeedbackPrompt({ isOpen, onClose, onSubmit, serviceName }) {
  const [mode, setMode] = useState('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [textFeedback, setTextFeedback] = useState('');
  const { t } = useTranslation();

  const resetState = () => {
    setMode('voice');
    setIsRecording(false);
    setTextFeedback('');
  };

  const handleToggleRecord = () => {
    setIsRecording((prev) => !prev);
  };

  const handleSubmit = () => {
    const payload = {
      serviceName: serviceName || 'Unknown service',
      mode,
      text: mode === 'text' ? textFeedback.trim() : '',
      audioRecorded: mode === 'voice' ? isRecording : false,
      timestamp: new Date().toISOString(),
    };

    if (mode === 'text' && !payload.text) return;
    if (mode === 'voice' && !isRecording) return;

    onSubmit?.(payload);
    resetState();
    onClose();
  };

  const handleSkip = () => {
    resetState();
    onClose();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const canSubmit =
    (mode === 'text' && textFeedback.trim().length > 0) ||
    (mode === 'voice' && isRecording);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('feedback.title')}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-light mb-4">
          <MessageSquare size={24} className="text-primary" />
        </div>

        <h3 className="text-base font-semibold text-text-primary mb-1">
          {t('feedback.question')}
        </h3>
        <p className="text-sm text-text-secondary mb-5">{t('feedback.anonymous')}</p>

        <div
          role="tablist"
          aria-label="Feedback input mode"
          className="inline-flex items-center bg-page-bg rounded-pill p-1 mb-5"
        >
          <button
            role="tab"
            aria-selected={mode === 'voice'}
            onClick={() => setMode('voice')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${
              mode === 'voice'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Mic size={14} />
            {t('feedback.voice')}
          </button>
          <button
            role="tab"
            aria-selected={mode === 'text'}
            onClick={() => setMode('text')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${
              mode === 'text'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Keyboard size={14} />
            {t('feedback.text')}
          </button>
        </div>

        {mode === 'voice' && (
          <div>
            <button
              onClick={handleToggleRecord}
              aria-label={isRecording ? t('feedback.stop') : t('feedback.record')}
              className={`w-full flex items-center justify-center gap-2 rounded-btn py-3 font-medium transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-primary hover:bg-primary-dark text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <Square size={16} fill="currentColor" />
                  {t('feedback.stop')}
                </>
              ) : (
                <>
                  <Mic size={16} />
                  {t('feedback.record')}
                </>
              )}
            </button>

            {isRecording && (
              <p className="text-xs text-red-500 mt-3 animate-pulse" aria-live="polite">
                ● {t('feedback.recording')}
              </p>
            )}
          </div>
        )}

        {mode === 'text' && (
          <div>
            <textarea
              value={textFeedback}
              onChange={(e) => {
                if (e.target.value.length <= 500) setTextFeedback(e.target.value);
              }}
              placeholder={t('feedback.textPlaceholder')}
              maxLength={500}
              rows={4}
              aria-label={t('feedback.textPlaceholder')}
              className="w-full resize-none rounded-btn border border-border bg-page-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-border focus:ring-1 focus:ring-primary-border"
            />
            <p className="text-xs text-text-secondary text-left mt-2">
              {textFeedback.length}/500 {t('feedback.charCount')}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSkip}
            className="flex-1 py-2.5 rounded-btn border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {t('feedback.skip')}
          </button>

          {canSubmit && (
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-btn bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
            >
              {t('feedback.submit')}
            </button>
          )}
        </div>

        <p className="text-[11px] text-text-secondary mt-4">
          🔒 {t('feedback.anonymous')}
        </p>
      </div>
    </Modal>
  );
}

export default FeedbackPrompt;