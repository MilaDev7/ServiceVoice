import { useState } from 'react';
import { Mic, Square, Keyboard, MessageSquare } from 'lucide-react';
import Modal from '../../../shared/components/Modal';

function FeedbackPrompt({ isOpen, onClose, onSubmit, serviceName }) {
  const [mode, setMode] = useState('voice'); // 'voice' | 'text'
  const [isRecording, setIsRecording] = useState(false);
  const [textFeedback, setTextFeedback] = useState('');

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

    // Prevent empty submits
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Share your experience">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-light mb-4">
          <MessageSquare size={24} className="text-primary" />
        </div>

        <h3 className="text-base font-semibold text-text-primary mb-1">
          How was your experience?
        </h3>
        <p className="text-sm text-text-secondary mb-5">
          Help others by sharing anonymously. Choose voice or text — whatever
          works best for you.
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
            onClick={() => setMode('voice')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${
              mode === 'voice'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Mic size={14} />
            Voice
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
            Text
          </button>
        </div>

        {/* Voice mode */}
        {mode === 'voice' && (
          <div>
            <button
              onClick={handleToggleRecord}
              aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
              className={`w-full flex items-center justify-center gap-2 rounded-btn py-3 font-medium transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-primary hover:bg-primary-dark text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <Square size={16} fill="currentColor" />
                  Stop recording
                </>
              ) : (
                <>
                  <Mic size={16} />
                  Record voice feedback
                </>
              )}
            </button>

            {isRecording && (
              <p
                className="text-xs text-red-500 mt-3 animate-pulse"
                aria-live="polite"
              >
                ● Recording... tap stop when finished
              </p>
            )}
          </div>
        )}

        {/* Text mode */}
        {mode === 'text' && (
          <div>
            <textarea
              value={textFeedback}
              onChange={(e) => setTextFeedback(e.target.value)}
              placeholder="Type your feedback here..."
              rows={4}
              aria-label="Your feedback"
              className="w-full resize-none rounded-btn border border-border bg-page-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-border focus:ring-1 focus:ring-primary-border"
            />
            <p className="text-xs text-text-secondary text-left mt-2">
              {textFeedback.length}/500 characters
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSkip}
            className="flex-1 py-2.5 rounded-btn border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>

          {canSubmit && (
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-btn bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors"
            >
              Submit
            </button>
          )}
        </div>

        <p className="text-[11px] text-text-secondary mt-4">
          🔒 Your feedback is anonymous. We don't collect your name or phone number.
        </p>
      </div>
    </Modal>
  );
}

export default FeedbackPrompt;