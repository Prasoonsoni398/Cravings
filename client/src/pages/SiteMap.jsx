import { Link } from "react-router-dom";

const groups = [
  ["Main", [["Home", "/"], ["About", "/about"], ["Order Now", "/order-now"]]],
  ["Account", [["Login", "/login"], ["Customer Register", "/register/customer"], ["Restaurant Register", "/register/restaurant"], ["Rider Register", "/register/rider"]]],
  ["Support", [["Contact", "/contact"], ["Feedback", "/feedback"], ["Help Center", "/help-center"]]],
  ["Legal", [["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms-of-service"]]],
];

const SiteMap = () => {
  return (
    <main className="min-h-screen bg-base-100 px-6 py-14">
      <section className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Cravings</p>
        <h1 className="mb-8 text-4xl font-bold text-(--color-neutral)">Site Map</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {groups.map(([title, links]) => (
            <div key={title} className="rounded-xl bg-base-100 p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-(--color-neutral)">{title}</h2>
              <ul className="space-y-3">
                {links.map(([label, path]) => (
                  <li key={path}>
                    <Link to={path} className="text-secondary transition hover:text-primary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SiteMap;
