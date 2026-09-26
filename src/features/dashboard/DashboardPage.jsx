import { FileText, Clock, AlertCircle, FileWarning } from 'lucide-react';
import StatCard from './components/StatCard';
import StatSection from './components/StatSection';
import BarRow from './components/BarRow';
import { mockDashboard } from './data/mockDashboard';

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
  const maxService = Math.max(...data.byService.map((s) => s.count));
  const maxWoreda = Math.max(...data.byWoreda.map((w) => w.count));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Public Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Anonymous feedback from citizens across Addis Ababa.
        </p>
        <p className="text-xs text-text-secondary mt-1">
          Data as of {formatUpdated(data.lastUpdated)}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard
          label="Reports"
          value={data.summary.totalReports}
          icon={FileText}
          tone="primary"
        />
        <StatCard
          label="Avg time"
          value={data.summary.avgTimeDays}
          suffix="days"
          icon={Clock}
          tone="yellow"
        />
        <StatCard
          label="Extra fee"
          value={`${data.summary.extraFeePercent}%`}
          icon={AlertCircle}
          tone="red"
        />
        <StatCard
          label="Extra doc"
          value={`${data.summary.extraDocPercent}%`}
          icon={FileWarning}
          tone="red"
        />
      </div>

      {/* Two columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <StatSection title="Reports by Service">
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

        <StatSection title="Reports by Woreda">
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

      {/* Full-width feedback types */}
      <StatSection title="Feedback Types">
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

      {/* Privacy footer */}
      <div className="mt-6 p-4 bg-primary-light border border-primary-border rounded-card">
        <p className="text-xs text-primary-dark">
          🔒 All reports are anonymous. We never collect names, phone numbers,
          or identifying information.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;