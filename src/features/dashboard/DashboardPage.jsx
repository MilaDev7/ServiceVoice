import { useState, useEffect } from 'react';
import { FileText, Clock, AlertCircle, FileWarning, Loader2 } from 'lucide-react';
import StatCard from './components/StatCard';
import StatSection from './components/StatSection';
import BarRow from './components/BarRow';
import { mockDashboard } from './data/mockDashboard';
import { useTranslation } from '../../i18n';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function formatUpdated(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function DashboardPage() {
  const [data, setData] = useState(mockDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        const res = await api.get('/feedback/dashboard');
        // Backend returns { summary, byService, byWoreda, byFeedbackType, lastUpdated }
        if (!cancelled && res) {
          setData({
            summary: res.summary || mockDashboard.summary,
            byService: res.byService?.length ? res.byService : mockDashboard.byService,
            byWoreda: res.byWoreda?.length ? res.byWoreda : mockDashboard.byWoreda,
            byFeedbackType: res.byFeedbackType?.length
              ? res.byFeedbackType
              : mockDashboard.byFeedbackType,
            lastUpdated: res.lastUpdated || new Date().toISOString(),
          });
          setIsLive(true);
        }
      } catch (err) {
        // Backend endpoint not ready — keep mock
        console.warn('[dashboard] falling back to mock data:', err.message);
        if (!cancelled) {
          setData(mockDashboard);
          setIsLive(false);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const maxService = Math.max(...data.byService.map((s) => s.count), 1);
  const maxWoreda = Math.max(...data.byWoreda.map((w) => w.count), 1);

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-text-secondary">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {t('dashboard.title')}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {t('dashboard.subtitle')}
        </p>
        <p className="text-xs text-text-secondary mt-1">
          {t('dashboard.dataAsOf')} {formatUpdated(data.lastUpdated)}
          {!isLive && (
            <span className="ml-2 px-1.5 py-0.5 rounded-pill bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-[10px] font-medium">
              DEMO DATA
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
       <button
  onClick={() => navigate('/feedback/list')}
  className="text-left w-full hover:scale-[1.02] transition-transform"
>
  <StatCard
    label={t('dashboard.reports')}
    value={data.summary.totalReports}
    icon={FileText}
    tone="primary"
    hint="Click to view reports →"
  />
</button>
        <StatCard
          label={t('dashboard.avgTime')}
          value={data.summary.avgTimeDays}
          suffix={t('dashboard.avgTimeSuffix')}
          icon={Clock}
          tone="yellow"
        />
        <StatCard
          label={t('dashboard.extraFee')}
          value={`${data.summary.extraFeePercent}%`}
          icon={AlertCircle}
          tone="red"
        />
        <StatCard
          label={t('dashboard.extraDoc')}
          value={`${data.summary.extraDocPercent}%`}
          icon={FileWarning}
          tone="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <StatSection title={t('dashboard.byService')}>
          {data.byService.map((s) => (
            <BarRow
              key={s.id}
              label={s.name}
              value={s.count}
              max={maxService}
              color="primary"
            />
          ))}
        </StatSection>

        <StatSection title={t('dashboard.byWoreda')}>
          {data.byWoreda.map((w) => (
            <BarRow
              key={w.id}
              label={w.name}
              value={w.count}
              max={maxWoreda}
              color="primary"
            />
          ))}
        </StatSection>
      </div>

      {data.byFeedbackType.length > 0 && (
        <StatSection title={t('dashboard.byType')}>
          {data.byFeedbackType.map((f) => (
            <BarRow
              key={f.id}
              label={f.label}
              value={f.percent}
              max={100}
              suffix="%"
              color={f.color}
            />
          ))}
        </StatSection>
      )}

      <div className="mt-6 p-4 bg-primary-light border border-primary-border rounded-card">
        <p className="text-xs text-primary-dark dark:text-green-300">
          🔒 {t('dashboard.privacy')}
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;