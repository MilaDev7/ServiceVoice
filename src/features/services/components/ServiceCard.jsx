import { useNavigate } from 'react-router-dom';
import {
  IdCard,
  FileText,
  FileX,
  Heart,
  FileCheck,
  UserCheck,
  FileQuestion,
} from 'lucide-react';
import { usePreferences } from '../../settings/hooks/usePreferences';

const ICON_MAP = {
  IdCard,
  FileText,
  FileX,
  Heart,
  FileCheck,
  UserCheck,
};

const CATEGORY_STYLES = {
  Identity: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Vital Record':
    'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'Civil Status':
    'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
};

function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { language } = usePreferences();

  const IconComponent = ICON_MAP[service.icon] || FileQuestion;
  const displayName = language === 'am' ? service.nameAm : service.nameEn;
  const secondaryName = language === 'am' ? service.nameEn : service.nameAm;
  const prompt = language === 'am' ? service.promptAm : service.prompt;
  const categoryClass =
    CATEGORY_STYLES[service.category] || CATEGORY_STYLES.Identity;

  const handleClick = () => {
    // Navigate to chat with the prompt in the URL
    navigate(`/?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <button
      onClick={handleClick}
      className="text-left bg-surface border border-border rounded-card p-4 hover:border-primary-border hover:shadow-card transition-all group"
      aria-label={`Ask about ${service.nameEn}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <IconComponent size={18} className="text-primary group-hover:text-white" />
        </div>
        <span
          className={`px-2 py-0.5 rounded-pill text-[10px] font-medium ${categoryClass}`}
        >
          {service.category}
        </span>
      </div>

      <p
        className={`text-sm font-semibold text-text-primary leading-tight ${
          language === 'am' ? 'font-amharic' : ''
        }`}
      >
        {displayName}
      </p>
      <p className="text-xs text-text-secondary mt-0.5 truncate">
        {secondaryName}
      </p>
    </button>
  );
}

export default ServiceCard;