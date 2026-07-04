const TermsOfService = () => {
  return (
    <main className="min-h-screen bg-base-100 px-6 py-14">
      <section className="mx-auto max-w-4xl rounded-xl bg-base-100 p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Cravings</p>
        <h1 className="mb-6 text-4xl font-bold text-(--color-neutral)">Terms of Service</h1>
        <div className="space-y-6 leading-relaxed text-secondary">
          <p>
            By using Cravings, you agree to provide accurate account information and use the platform only for lawful food ordering, delivery, and restaurant services.
          </p>
          <p>
            Restaurant availability, menu items, prices, delivery times, and promotions may change based on partner operations and local conditions.
          </p>
          <p>
            Payments, cancellations, refunds, and support requests are handled according to the order status and applicable partner policies.
          </p>
          <p>
            Cravings may update these terms as services evolve. Continued use of the platform means you accept the latest terms.
          </p>
        </div>
      </section>
    </main>
  );
};

export default TermsOfService;
