const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-base-100 px-6 py-14">
      <section className="mx-auto max-w-4xl rounded-xl bg-base-100 p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Cravings</p>
        <h1 className="mb-6 text-4xl font-bold text-(--color-neutral)">Privacy Policy</h1>
        <div className="space-y-6 leading-relaxed text-secondary">
          <p>
            We collect the information needed to create accounts, process orders, deliver food, improve service quality, and keep the platform secure.
          </p>
          <p>
            Your personal details are shared only with trusted parties involved in fulfilling your order, such as restaurants, delivery partners, and payment providers.
          </p>
          <p>
            We use cookies and analytics to understand usage patterns and improve your experience. You can manage browser cookie settings at any time.
          </p>
          <p>
            For privacy requests or account data questions, contact our support team through the Contact page.
          </p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
