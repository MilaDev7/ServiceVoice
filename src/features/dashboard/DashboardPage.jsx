import { FileText, Clock, AlertCircle, FileWarning } from 'lucide-react';
import StatCard from './components/StatCard';
import StatSection from './components/StatSection';
import BarRow from './components/BarRow';
import { mockDashboard } from './data/mockDashboard';
import { useTranslation } from '../../i18n';

function formatUpdated(iso) {
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
  const data = mockDashboard;
  const { t } = useTranslation();
  const maxService = Math.max(...data.byService.map((s) => s.count));
  const maxWoreda = Math.max(...data.byWoreda.map((w) => w.count));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{t('dashboard.title')}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('dashboard.subtitle')}</p>
        <p className="text-xs text-text-secondary mt-1">
          {t('dashboard.dataAsOf')} {formatUpdated(data.lastUpdated)}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard
          label={t('dashboard.reports')}
          value={data.summary.totalReports}
          icon={FileText}
          tone="primary"
        />
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

      <div className="mt-6 p-4 bg-primary-light border border-primary-border rounded-card">
        <p className="text-xs text-primary-dark dark:text-green-300">
          🔒 {t('dashboard.privacy')}
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;