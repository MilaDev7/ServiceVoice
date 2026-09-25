import { IdCard, FileText, Calendar, CreditCard, Users, FileQuestion } from 'lucide-react';

const ICON_MAP = {
  IdCard,
  FileText,
  Calendar,
  CreditCard,
  Users,
};

function DocumentItem({ icon, title, description }) {
  const IconComponent = ICON_MAP[icon] || FileQuestion;

  return (
    <div className="flex items-start gap-3 p-3 rounded-btn hover:bg-primary-light/50 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
        <IconComponent size={16} className="text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary leading-snug">
          {title}
        </p>
        <p className="text-xs text-text-secondary mt-0.5 leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
}

export default DocumentItem;