const stats = [
  { value: "2.5M+", label: "Successful Deliveries" },
  { value: "500K+", label: "Happy Customers" },
  { value: "5K+", label: "Partner Restaurants" },
  { value: "1K+", label: "Active Delivery Partners" },
];

function StatsSection() {
  return (
    <section className="bg-primary/50 px-6 py-20 text-primary-content">
      <div className="mx-auto max-w-7xl flex justify-center flex-col">
        <div className="mb-20 max-w-7xl text-center">
          <p className="text-4xl font-bold uppercase ">Cravings by the Numbers</p>
          <h2 className="mt-2 text-xl font-bold">
           See why millions trust us for their daily food delivery needs
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
              <div className="text-4xl font-black">{stat.value}</div>
              <p className="mt-2 text-sm text-primary-content/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
