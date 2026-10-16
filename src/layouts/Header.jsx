import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ShieldCheck,
  Bell,
  LogOut,
  User as UserIcon,
  Settings,
} from 'lucide-react';
import { usePreferences } from '../features/settings/hooks/usePreferences';
import { LANGUAGES } from '../app/providers';
import { useTranslation } from '../i18n';
import { useAuth } from '../features/auth/components/AuthProvider';

function Header({ onMenuClick }) {
  const { language, setLanguage, currentWoreda } = usePreferences();
  const { t } = useTranslation();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initial = (user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase();

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const goToProfile = () => {
    setIsMenuOpen(false);
    navigate('/profile');
  };

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary"
          aria-label={t('header.openSidebar')}
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-primary text-sm font-medium">
          <ShieldCheck size={16} />
          <span>{t('header.secure')}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Language toggle */}
          <div className="hidden sm:flex items-center bg-page-bg rounded-pill p-0.5 text-xs font-medium">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-2.5 py-1 rounded-pill transition-colors ${
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

          <div className="hidden md:block text-xs text-text-secondary px-2 py-1">
            📍 {currentWoreda.name}, {currentWoreda.city}
          </div>

          <button
            className="p-1.5 text-text-secondary hover:text-text-primary relative"
            aria-label={t('header.notifications')}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors p-0.5 pr-2"
              aria-label="Account menu"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {initial}
              </div>
              {isAuthenticated && (
                <span className="hidden sm:block text-xs font-medium text-text-primary truncate max-w-[100px]">
                  {user?.name || user?.email?.split('@')[0]}
                </span>
              )}
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-64 bg-surface border border-border rounded-card shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-border">
                    {isAuthenticated ? (
                      <>
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {user?.name || 'Signed in'}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {user?.email}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-text-primary">
                          Guest
                        </p>
                        <p className="text-xs text-text-secondary">
                          Chats stay on this device
                        </p>
                      </>
                    )}
                  </div>

                  <div className="p-2">
                    <button
                      onClick={goToProfile}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <UserIcon size={16} />
                      Profile
                    </button>
                    <button
                      onClick={goToProfile}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </button>

                    {isAuthenticated ? (
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    ) : (
                      <button
                        onClick={goToProfile}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm text-primary hover:bg-primary-light transition-colors font-medium"
                      >
                        <UserIcon size={16} />
                        Sign in
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;