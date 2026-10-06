import { useState, useEffect } from 'react';
import { X, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';

function ForgotPasswordModal({ isOpen, onClose, onBackToSignIn }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setError(null);
      setIsSent(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword(email.trim());
      setIsSent(true);
    } catch (err) {
      setError(err.message || 'Could not send reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Reset password"
    >
      <div
        className="w-full max-w-md bg-surface rounded-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            {onBackToSignIn && (
              <button
                onClick={onBackToSignIn}
                className="p-1 text-text-secondary hover:text-text-primary"
                aria-label="Back to sign in"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <h2 className="font-semibold text-text-primary">Reset password</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {isSent ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-light mb-4">
                <CheckCircle2 size={28} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Check your email
              </h3>
              <p className="text-sm text-text-secondary mb-5">
                If an account exists for <strong>{email}</strong>, you'll
                receive a reset link shortly. Check your spam folder too.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-primary hover:bg-primary-dark text-white rounded-btn py-2.5 font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-text-secondary">
                Enter the email you signed up with. We'll send you a link to
                reset your password.
              </p>

              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-xs font-medium text-text-primary mb-1.5"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-btn border border-border bg-page-bg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-border focus:ring-1 focus:ring-primary-border disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-btn bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-btn py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;