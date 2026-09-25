import { Menu, ShieldCheck, Bell } from 'lucide-react';

function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {/* Left: Menu (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-text-secondary hover:text-text-primary"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Center: Secure badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-primary text-sm font-medium">
          <ShieldCheck size={16} />
          <span>Secure &amp; Private</span>
        </div>

        {/* Right: Language + Woreda + Notifications + Profile */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Language toggle placeholder */}
          <div className="hidden sm:flex items-center bg-page-bg rounded-pill p-0.5 text-xs font-medium">
            <button className="px-2.5 py-1 rounded-pill bg-surface text-primary shadow-sm">
              አማ
            </button>
            <button className="px-2.5 py-1 rounded-pill text-text-secondary">EN</button>
          </div>

          {/* Woreda selector placeholder */}
          <button className="hidden md:block text-xs text-text-secondary hover:text-text-primary px-2 py-1">
            📍 Bole, Addis Ababa
          </button>

          {/* Notifications */}
          <button
            className="p-1.5 text-text-secondary hover:text-text-primary relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Profile */}
          <button className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm hover:bg-primary-border transition-colors">
            U
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;