import { useState, useEffect } from 'react';
import { Mic, Square, Keyboard, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Modal from '../../../shared/components/Modal';
import { useTranslation } from '../../../i18n';

function FeedbackPrompt({ isOpen, onClose, onSubmit, serviceName }) {
  const [mode, setMode] = useState('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [textFeedback, setTextFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { t } = useTranslation();

  // Reset everything when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode('voice');
      setIsRecording(false);
      setTextFeedback('');
      setIsSubmitting(false);
      setIsSubmitted(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  const handleToggleRecord = () => {
    setIsRecording((prev) => !prev);
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    const payload = {
      serviceName: serviceName || null,
      mode,
      text: mode === 'text' ? textFeedback.trim() : '',
      audioRecorded: mode === 'voice' ? isRecording : false,
      timestamp: new Date().toISOString(),
    };

    // Guard — shouldn't happen because button is disabled otherwise
    if (mode === 'text' && !payload.text) return;
    if (mode === 'voice' && !isRecording) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(payload);
      setIsSubmitted(true);

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('[feedback] submit failed:', err);
      setSubmitError(err?.message || 'Could not submit feedback. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const canSubmit =
    !isSubmitting &&
    ((mode === 'text' && textFeedback.trim().length > 0) ||
      (mode === 'voice' && isRecording));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSubmitted ? 'Feedback received' : t('feedback.title')}
    >
      {/* ─────────────────────────────────────────────
          SUCCESS STATE
          ───────────────────────────────────────────── */}
      {isSubmitted ? (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-light mb-4">
            <CheckCircle2 size={28} className="text-primary" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">
            Thank you!
          </h3>
          <p className="text-sm text-text-secondary">
            Your feedback has been submitted anonymously.
          </p>
          <p className="text-xs text-text-secondary mt-4">
            You can see aggregated reports on the Public Dashboard.
          </p>
        </div>
      ) : (
        /* ─────────────────────────────────────────────
            FORM STATE
            ───────────────────────────────────────────── */
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-light mb-4">
            <MessageSquare size={24} className="text-primary" />
          </div>

          <h3 className="text-base font-semibold text-text-primary mb-1">
            {t('feedback.question')}
          </h3>
          <p className="text-sm text-text-secondary mb-5">
            {t('feedback.anonymous')}
          </p>

          {/* Mode toggle */}
          <div
            role="tablist"
            aria-label="Feedback input mode"
            className="inline-flex items-center bg-page-bg rounded-pill p-1 mb-5"
          >
            <button
              role="tab"
              aria-selected={mode === 'voice'}
              onClick={() => !isSubmitting && setMode('voice')}
              disabled={isSubmitting}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-sm font-medium transition-colors disabled:opacity-50 ${
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
              onClick={() => !isSubmitting && setMode('text')}
              disabled={isSubmitting}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-sm font-medium transition-colors disabled:opacity-50 ${
                mode === 'text'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Keyboard size={14} />
              {t('feedback.text')}
            </button>
          </div>

          {/* Voice mode */}
          {mode === 'voice' && (
            <div>
              <button
                onClick={handleToggleRecord}
                disabled={isSubmitting}
                aria-label={isRecording ? t('feedback.stop') : t('feedback.record')}
                className={`w-full flex items-center justify-center gap-2 rounded-btn py-3 font-medium transition-colors disabled:opacity-50 ${
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
                <p
                  className="text-xs text-red-500 mt-3 animate-pulse"
                  aria-live="polite"
                >
                  ● {t('feedback.recording')}
                </p>
              )}
            </div>
          )}

          {/* Text mode */}
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
                disabled={isSubmitting}
                aria-label={t('feedback.textPlaceholder')}
                className="w-full resize-none rounded-btn border border-border bg-page-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-border focus:ring-1 focus:ring-primary-border disabled:opacity-50"
              />
              <p className="text-xs text-text-secondary text-left mt-2">
                {textFeedback.length}/500 {t('feedback.charCount')}
              </p>
            </div>
          )}

          {/* Error message */}
          {submitError && (
            <div className="mt-4 px-3 py-2 rounded-btn bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 dark:text-red-400 text-left">
                {submitError}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-btn border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
            >
              {t('feedback.skip')}
            </button>

            {canSubmit && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-btn bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>{t('feedback.submit')}</>
                )}
              </button>
            )}
          </div>

          <p className="text-[11px] text-text-secondary mt-4">
            🔒 {t('feedback.anonymous')}
          </p>
        </div>
      )}
    </Modal>
  );
}

export default FeedbackPrompt;