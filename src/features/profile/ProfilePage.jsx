import { useState } from 'react';
import {
  Sun,
  Moon,
  Trash2,
  Shield,
  LogIn,
  LogOut,
  User as UserIcon,
  Mail,
} from 'lucide-react';
import ProfileSection from './components/ProfileSection';
import PreferenceRow from './components/PreferenceRow';
import { usePreferences } from '../settings/hooks/usePreferences';
import { LANGUAGES, WOREDAS } from '../../app/providers';
import { useTranslation } from '../../i18n';
import { useAuth } from '../auth/components/AuthProvider';
import AuthModal from '../auth/components/AuthModal';

function ProfilePage() {
  const {
    language,
    setLanguage,
    woredaId,
    setWoredaId,
    theme,
    setTheme,
    notifications,
    setNotifications,
    currentLanguage,
    currentWoreda,
  } = usePreferences();

  const { t } = useTranslation();
  const { user, isAuthenticated, signOut } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClearData = () => {
    const confirmed = window.confirm(
      'This will clear your preferences, chat history, and local data. Continue?'
    );
    if (confirmed) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSignOut = async () => {
    const confirmed = window.confirm('Sign out? Your local chats stay on this device.');
    if (!confirmed) return;
    await signOut();
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {t('profile.title')}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {/* ── Account ─────────────────────────────── */}
        <ProfileSection
          title="Account"
          description={
            isAuthenticated
              ? 'Signed in — your chats sync across devices.'
              : 'Sign in to sync your chats across devices. Optional.'
          }
        >
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-primary-light rounded-card">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <UserIcon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {user?.email || 'Signed in'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Your history syncs automatically
                  </p>
                </div>
              </div>

              <PreferenceRow
                label="Sign out"
                description="You can continue as a guest after signing out"
              >
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-border text-text-primary text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </PreferenceRow>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-page-bg rounded-card">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <UserIcon size={20} className="text-text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text-primary">
                    Guest mode
                  </p>
                  <p className="text-xs text-text-secondary">
                    Chats stay on this device only
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-btn py-2.5 font-medium transition-colors"
              >
                <LogIn size={16} />
                Sign in or create account
              </button>

              <p className="text-[11px] text-text-secondary text-center">
                Optional — ServiceVoice works fully without an account.
              </p>
            </div>
          )}
        </ProfileSection>

        {/* ── Your preferences ─────────────────────── */}
        <ProfileSection
          title={t('profile.yourPrefs')}
          description={t('profile.prefsDesc')}
        >
          <div className="flex items-center gap-4 p-4 bg-primary-light rounded-card">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-lg">U</span>
            </div>
            <div>
              <p className="font-semibold text-text-primary">
                {isAuthenticated ? user?.email : t('profile.anonymousUser')}
              </p>
              <p className="text-xs text-text-secondary">
                {isAuthenticated
                  ? 'Signed in'
                  : t('profile.anonymousDesc')}
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Language */}
        <ProfileSection
          title={t('profile.language')}
          description={t('profile.languageDesc')}
        >
          <PreferenceRow
            label={t('profile.preferredLang')}
            description={`${t('profile.currently')}: ${currentLanguage.label}`}
          >
            <div className="flex items-center bg-page-bg rounded-pill p-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-pill text-xs font-medium transition-colors ${
                    language === lang.code
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                  aria-pressed={language === lang.code}
                >
                  {lang.short}
                </button>
              ))}
            </div>
          </PreferenceRow>
        </ProfileSection>

        {/* Woreda */}
        <ProfileSection
          title={t('profile.location')}
          description={t('profile.locationDesc')}
        >
          <PreferenceRow
            label={t('profile.yourWoreda')}
            description={`${t('profile.currently')}: ${currentWoreda.name}`}
          >
            <select
              value={woredaId}
              onChange={(e) => setWoredaId(e.target.value)}
              className="text-sm border border-border rounded-btn px-3 py-1.5 bg-surface text-text-primary focus:outline-none focus:border-primary-border focus:ring-1 focus:ring-primary-border"
            >
              {WOREDAS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </PreferenceRow>
        </ProfileSection>

        {/* Theme */}
        <ProfileSection
          title={t('profile.appearance')}
          description={t('profile.appearanceDesc')}
        >
          <PreferenceRow
            label={t('profile.theme')}
            description={`${t('profile.currently')}: ${theme}`}
          >
            <div className="flex items-center bg-page-bg rounded-pill p-0.5">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-pressed={theme === 'light'}
              >
                <Sun size={14} />
                {t('profile.light')}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-pressed={theme === 'dark'}
              >
                <Moon size={14} />
                {t('profile.dark')}
              </button>
            </div>
          </PreferenceRow>
        </ProfileSection>

        {/* Notifications */}
        <ProfileSection
          title={t('profile.notifications')}
          description={t('profile.notificationsDesc')}
        >
          <PreferenceRow
            label={t('profile.voiceResponses')}
            description={t('profile.voiceResponsesDesc')}
          >
            <ToggleSwitch
              checked={notifications.voice}
              onChange={() => toggleNotification('voice')}
            />
          </PreferenceRow>

          <PreferenceRow
            label={t('profile.smsAlerts')}
            description={t('profile.smsAlertsDesc')}
          >
            <ToggleSwitch
              checked={notifications.sms}
              onChange={() => toggleNotification('sms')}
            />
          </PreferenceRow>

          <PreferenceRow
            label={t('profile.pushNotifications')}
            description={t('profile.pushDesc')}
          >
            <ToggleSwitch
              checked={notifications.push}
              onChange={() => toggleNotification('push')}
            />
          </PreferenceRow>
        </ProfileSection>

        {/* Data & privacy */}
        <ProfileSection
          title={t('profile.dataPrivacy')}
          description={t('profile.dataPrivacyDesc')}
        >
          <div className="flex items-start gap-3 p-3 bg-primary-light rounded-btn">
            <Shield size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary-dark dark:text-green-300">
              {t('profile.privacyNote')}
            </p>
          </div>

          <PreferenceRow
            label={t('profile.clearData')}
            description={t('profile.clearDataDesc')}
          >
            <button
              onClick={handleClearData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 size={14} />
              {t('profile.clear')}
            </button>
          </PreferenceRow>
        </ProfileSection>

        <p className="text-center text-xs text-text-secondary pt-2">
          ServiceVoice · Hackathon build · v0.1
        </p>
      </div>

      {/* Auth modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default ProfilePage;