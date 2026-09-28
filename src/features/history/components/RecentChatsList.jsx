import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, MessageSquare } from 'lucide-react';
import { useChatHistory } from '../hooks/useChatHistory';
import { useTranslation } from '../../../i18n';

function formatTime(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function RecentChatsList({ onNavigate }) {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { sessions, deleteSession } = useChatHistory();
  const { t } = useTranslation();

  const handleClick = (id) => {
    navigate(`/chat/${id}`);
    onNavigate?.();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat?')) {
      deleteSession(id);
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <MessageSquare
          size={24}
          className="text-text-secondary mx-auto mb-2 opacity-40"
        />
        <p className="text-xs text-text-secondary">{t('nav.noChats')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {sessions.map((session) => {
        const isActive = sessionId === session.id;
        return (
          <div
            key={session.id}
            onClick={() => handleClick(session.id)}
            className={`group w-full text-left px-3 py-2 rounded-btn cursor-pointer transition-colors flex items-start gap-2 ${
              isActive
                ? 'bg-primary-light text-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div
                className={`text-sm truncate ${
                  isActive ? 'text-primary font-medium' : 'text-text-primary'
                }`}
              >
                {session.title}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {formatTime(session.updatedAt)}
              </div>
            </div>

            <button
              onClick={(e) => handleDelete(e, session.id)}
              aria-label="Delete chat"
              className="opacity-0 group-hover:opacity-100 p-1 text-text-secondary hover:text-red-500 transition-opacity flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default RecentChatsList;