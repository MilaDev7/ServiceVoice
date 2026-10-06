import { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useTranslation } from '../../../i18n';

function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const { signIn, signUp, error: authError, clearError } = useAuth();
  const { t } = useTranslation();

  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setLocalError(null);
      clearError();
    }
  }, [isOpen, initialMode, clearError]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Body scroll lock
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

  const validate = () => {
    if (!email.trim()) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Enter a valid email.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'signup' && password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      onClose();
    } catch (err) {
      // Error is set in AuthProvider; local shows too
      setLocalError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setLocalError(null);
    clearError();
  };

  if (!isOpen) return null;

  const displayError = localError || authError;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'signin' ? 'Sign in' : 'Create account'}
    >
      <div
        className="w-full max-w-md bg-surface rounded-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="auth-email"
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
                id="auth-email"
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

          {/* Password */}
          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-medium text-text-primary mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                disabled={isSubmitting}
                className="w-full pl-9 pr-10 py-2.5 text-sm rounded-btn border border-border bg-page-bg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-border focus:ring-1 focus:ring-primary-border disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              At least 6 characters
            </p>
          </div>

          {/* Confirm password (signup only) */}
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="auth-confirm"
                className="block text-xs font-medium text-text-primary mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  id="auth-confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  disabled={isSubmitting}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-btn border border-border bg-page-bg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-border focus:ring-1 focus:ring-primary-border disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* Error */}
          {displayError && (
            <div className="px-3 py-2 rounded-btn bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400">
                {displayError}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-btn py-2.5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>{mode === 'signin' ? 'Sign in' : 'Create account'}</>
            )}
          </button>

          {/* Switch mode */}
          <p className="text-center text-xs text-text-secondary">
            {mode === 'signin' ? "Don't have an account?" : 'Already have one?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              disabled={isSubmitting}
              className="text-primary hover:underline font-medium disabled:opacity-50"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Privacy note */}
          <p className="text-[11px] text-text-secondary text-center pt-1">
            🔒 We never share your email or use it for marketing.
          </p>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;