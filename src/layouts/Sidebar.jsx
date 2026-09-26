import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquarePlus, MessageSquare, Clock, Star, User, X } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { to: ROUTES.CHAT, label: 'Chat', icon: MessageSquare, end: true },
  { to: ROUTES.SERVICES, label: 'Services', icon: Star },
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: Clock },
  { to: ROUTES.PROFILE, label: 'Profile', icon: User },
];

const PLACEHOLDER_RECENT = [
  { id: '1', title: 'Birth certificate process', time: 'Today, 9:41 AM' },
  { id: '2', title: 'Kebele ID requirements', time: 'Yesterday, 4:30 PM' },
  { id: '3', title: 'Marriage certificate', time: 'May 20, 2024' },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate(ROUTES.CHAT);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-[260px] bg-surface border-r border-border z-50',
          'flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo + mobile close */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="font-semibold text-text-primary">ServiceVoice</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-btn py-2.5 font-medium transition-colors"
          >
            <MessageSquarePlus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-3 pb-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
  clsx(
    'flex items-center gap-3 px-3 py-2.5 rounded-btn mb-1 transition-colors',
    isActive
      ? 'bg-primary-light text-primary font-medium'
      : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary dark:hover:bg-gray-700/50'
  )
}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Recent chats */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <h3 className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Recent Chats
          </h3>
          {PLACEHOLDER_RECENT.map((chat) => (
            <button
              key={chat.id}
              className="w-full text-left px-3 py-2 rounded-btn hover:bg-gray-100 transition-colors dark:hover:bg-gray-700/50"
            >
              <div className="text-sm text-text-primary truncate">{chat.title}</div>
              <div className="text-xs text-text-secondary mt-0.5">{chat.time}</div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;