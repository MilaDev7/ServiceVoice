import ServiceCard from './components/ServiceCard';
import { SERVICES } from './data/services';

function ServicesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Services</h1>
        <p className="text-sm text-text-secondary mt-1">
          Browse 6 vital record services. Tap any to ask about it.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {SERVICES.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary-light border border-primary-border rounded-card">
        <p className="text-xs text-primary-dark dark:text-green-300">
          🎙️ You can also ask by voice — tap the mic button anytime.
        </p>
      </div>
    </div>
  );
}

export default ServicesPage;