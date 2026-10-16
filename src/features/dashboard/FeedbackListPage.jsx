import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  FileWarning,
  ThumbsUp,
  HelpCircle,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import api from '../../services/api';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const TYPE_CONFIG = {
  extra_document: {
    label: 'Extra document requested',
    icon: FileWarning,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
  },
  bribe_request: {
    label: 'Extra fee / bribe requested',
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
  },
  delay: {
    label: 'Delayed beyond official time',
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  good_experience: {
    label: 'Good experience',
    icon: ThumbsUp,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
  },
  other: {
    label: 'Other feedback',
    icon: MessageSquare,
    color: 'text-text-secondary',
    bg: 'bg-page-bg',
    border: 'border-border',
  },
};

function relativeTime(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
function FeedbackListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get('/feedback/list', {
          params: { page, limit: 20 },
        });
        if (!cancelled) {
          setItems(res.items || []);
          setPagination(res.pagination || null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load reports');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-3 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-text-primary">
          Anonymous Reports
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Newest first
          {pagination && ` · ${pagination.total} total`}
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-text-secondary">
          <Loader2 size={20} className="animate-spin mr-2" />
          <span className="text-sm">Loading reports...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-card">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare size={32} className="text-text-secondary mx-auto mb-3 opacity-40" />
          <p className="text-sm text-text-secondary">No reports yet.</p>
          <p className="text-xs text-text-secondary mt-1">
            Be the first to share anonymously.
          </p>
        </div>
      )}

      {/* List */}
      {!isLoading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => {
            const config = TYPE_CONFIG[item.feedbackType] || TYPE_CONFIG.other;
            const Icon = config.icon;
            return (
              <div
                key={item.id}
                className="bg-surface border border-border rounded-card p-4 hover:shadow-card transition-shadow"
              >
                {/* Type badge + relative time */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-pill text-[11px] font-medium ${config.bg} ${config.color} border ${config.border}`}
                  >
                    <Icon size={12} />
                    {config.label}
                  </div>
                  <span className="text-xs text-text-secondary">
                    {relativeTime(item.createdAt)}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap break-words">
                  {item.content}
                </p>

                {/* Footer: service + woreda */}
                {(item.serviceName || item.woredaId) && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-xs text-text-secondary">
                    {item.serviceName && (
                      <span className="flex items-center gap-1">
                        📄 {item.serviceName}
                      </span>
                    )}
                    {item.woredaId && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {item.woredaId}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-1 px-3 py-2 rounded-btn border border-border text-sm font-medium text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-xs text-text-secondary">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-1 px-3 py-2 rounded-btn border border-border text-sm font-medium text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Privacy note */}
      <div className="mt-8 p-4 bg-primary-light border border-primary-border rounded-card">
        <p className="text-xs text-primary-dark dark:text-green-300">
          🔒 All reports are anonymous. We never collect names, phone numbers,
          or identifying information.
        </p>
      </div>
    </div>
  );
}

export default FeedbackListPage;