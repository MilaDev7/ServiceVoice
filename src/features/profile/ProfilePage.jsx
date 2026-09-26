import { Sun, Moon, Trash2, Shield, Globe, MapPin, Bell } from 'lucide-react';
import ProfileSection from './components/ProfileSection';
import PreferenceRow from './components/PreferenceRow';
import { usePreferences } from '../settings/hooks/usePreferences';
import { LANGUAGES, WOREDAS } from '../../app/providers';

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

  const handleClearData = () => {
    const confirmed = window.confirm(
      'This will clear your preferences, chat history, and local data. Continue?'
    );
    if (confirmed) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Profile & Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Customize how ServiceVoice works for you.
        </p>
      </div>

      <div className="space-y-4">
        {/* Identity */}
        <ProfileSection
          title="Your preferences"
          description="These settings affect the entire app."
        >
          <div className="flex items-center gap-4 p-4 bg-primary-light rounded-card">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-lg">U</span>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Anonymous user</p>
              <p className="text-xs text-text-secondary">
                No account needed — your data stays on this device
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Language */}
        <ProfileSection
          title="Language"
          description="Choose the language for voice and text."
        >
          <PreferenceRow label="Preferred language" description={`Currently: ${currentLanguage.label}`}>
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
          title="Location"
          description="Used to show the correct office and fees."
        >
          <PreferenceRow
            label="Your woreda"
            description={`Currently: ${currentWoreda.name}`}
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
          title="Appearance"
          description="Choose light or dark mode."
        >
          <PreferenceRow label="Theme" description={`Currently: ${theme}`}>
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
                Light
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
                Dark
              </button>
            </div>
          </PreferenceRow>
        </ProfileSection>

        {/* Notifications */}
        <ProfileSection
          title="Notifications"
          description="Control how we reach you."
        >
          <PreferenceRow
            label="Voice responses"
            description="Play voice replies when available"
          >
            <ToggleSwitch
              checked={notifications.voice}
              onChange={() => toggleNotification('voice')}
            />
          </PreferenceRow>

          <PreferenceRow
            label="SMS alerts"
            description="Receive document checklists via SMS"
          >
            <ToggleSwitch
              checked={notifications.sms}
              onChange={() => toggleNotification('sms')}
            />
          </PreferenceRow>

          <PreferenceRow
            label="Push notifications"
            description="Browser notifications for updates"
          >
            <ToggleSwitch
              checked={notifications.push}
              onChange={() => toggleNotification('push')}
            />
          </PreferenceRow>
        </ProfileSection>

        {/* Data & privacy */}
        <ProfileSection
          title="Data & privacy"
          description="Your data stays on this device."
        >
          <div className="flex items-start gap-3 p-3 bg-primary-light rounded-btn">
            <Shield size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary-dark">
              We never collect your name, phone number, or location. Your feedback
              is always anonymous.
            </p>
          </div>

          <PreferenceRow
            label="Clear local data"
            description="Reset preferences and chat history"
          >
            <button
              onClick={handleClearData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </PreferenceRow>
        </ProfileSection>

        {/* About footer */}
        <p className="text-center text-xs text-text-secondary pt-2">
          ServiceVoice · Hackathon build · v0.1
        </p>
      </div>
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
        checked ? 'bg-primary' : 'bg-gray-300'
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