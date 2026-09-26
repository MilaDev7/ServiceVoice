function ProfileSection({ title, description, children }) {
  return (
    <section className="bg-surface border border-border rounded-card p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default ProfileSection;