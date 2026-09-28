import ServiceCard from './components/ServiceCard';
import { SERVICES } from './data/services';
import { useTranslation } from '../../i18n';

function ServicesPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{t('services.title')}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('services.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {SERVICES.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary-light border border-primary-border rounded-card">
        <p className="text-xs text-primary-dark dark:text-green-300">
          🎙️ {t('services.voiceHint')}
        </p>
      </div>
    </div>
  );
}

export default ServicesPage;