const testimonials = [
  {
    quote:
      "The food arrived hot and fresh. The delivery was incredibly fast. Highly impressed with Cravings' service!",
    name: "AJ",
    role: "Verified Buyer",
  },
  {
    quote:
      "Easy to use interface, wide variety of restaurants, and quick delivery. I order from Cravings every week!",
    name: "Sneha P.",
    role: "Verified Buyer",
  },
  {
    quote:
      "Love the variety of restaurants available. Found my new favorite spot through Cravings. Definitely worth it!",
    name: "Raj Kumar",
    role: "Verified Buyer",
  },
];

function Testimonials() {
  return (
    <section className="bg-base-200 px-6 py-20">
      <div className="mx-auto max-w-7xl justify-center flex flex-col gap-10">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">What Our Customers Say</p>
          <h2 className="mt-2 text-3xl font-bold text-base-content sm:text-4xl">
            Real feedback from real food lovers
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-3xl border border-base-300 bg-base-100 p-8 shadow-md">
              <div className="mb-4 flex gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <p className="text-base leading-7 text-base-content/80">“{item.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-base-content">{item.name}</p>
                <p className="text-sm text-base-content/60">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
