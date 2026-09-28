import {
  IdCard,
  FileText,
  FileCheck,
  Calendar,
  CreditCard,
  Users,
  FileQuestion,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { useTranslation } from '../../../i18n';

const ICON_MAP = {
  IdCard,
  FileText,
  FileCheck,
  Calendar,
  CreditCard,
  Users,
};

const STATUS_CONFIG = {
  have: {
    labelKey: 'deps.have',
    StatusIcon: CheckCircle2,
    statusClass: 'text-green-600 dark:text-green-400',
    borderClass: 'border-green-200 dark:border-green-800',
    bgClass: 'bg-green-50 dark:bg-green-900/20',
  },
  need: {
    labelKey: 'deps.need',
    StatusIcon: XCircle,
    statusClass: 'text-red-500 dark:text-red-400',
    borderClass: 'border-red-200 dark:border-red-800',
    bgClass: 'bg-red-50 dark:bg-red-900/20',
  },
  unsure: {
    labelKey: 'deps.unsure',
    StatusIcon: HelpCircle,
    statusClass: 'text-gray-500 dark:text-gray-400',
    borderClass: 'border-gray-200 dark:border-gray-700',
    bgClass: 'bg-gray-50 dark:bg-gray-800',
  },
};

function DependencyTile({ icon, name, status, onClick }) {
  const { t } = useTranslation();
  const IconComponent = ICON_MAP[icon] || FileQuestion;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.unsure;
  const StatusIcon = config.StatusIcon;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-3 rounded-btn border ${config.borderClass} ${config.bgClass} hover:shadow-sm transition-all`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center">
        <IconComponent size={16} className="text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary leading-snug truncate">
          {name}
        </p>
        <div className={`flex items-center gap-1 mt-0.5 ${config.statusClass}`}>
          <StatusIcon size={12} strokeWidth={2.5} />
          <span className="text-xs font-medium">{t(config.labelKey)}</span>
        </div>
      </div>
    </button>
  );
}

export default DependencyTile;