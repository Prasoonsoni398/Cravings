import { Link } from "react-router-dom";
import { FaSearch, FaStar } from "react-icons/fa";
import { restaurants, stats, testimonials } from "../../data/siteData";

const Home = () => {
  return (
    <main className="min-h-screen bg-base-100">
      <section className="relative overflow-hidden py-16 text-primary-content md:py-40">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/bgImage4-L1QELaMd.jpg"
            alt="Food table"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-black/40"></div>
        <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Your Favorite Food,
              <br />
              Delivered Fast
            </h1>
            <p className="mb-8 text-lg opacity-90 md:text-xl">
              Order from thousands of restaurants and get it delivered to your doorstep
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-content transition hover:opacity-90"
              >
                Sign Up
              </Link>
              <Link
                to="/order-now"
                className="rounded-lg bg-base-100 px-8 py-3 font-semibold text-base-content transition hover:bg-base-200"
              >
                Order Now
              </Link>
            </div>
          </div>
          <div className="mx-auto flex max-w-4xl items-center rounded-lg bg-base-100 px-4 py-3">
            <FaSearch className="mr-3 text-xl text-base-content" />
            <input
              placeholder="Search restaurants or dishes..."
              className="w-full bg-base-100 text-primary outline-none"
              type="text"
            />
          </div>
        </div>
      </section>

      <section className="bg-linear-to-b from-primary to-primary-content py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-primary-content md:text-3xl">
              Featured Restaurants
            </h2>
            <p className="text-primary-content/70">
              {restaurants.length} restaurants available
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <article
                key={restaurant.id}
                className="flex flex-col overflow-hidden rounded-xl bg-base-100 shadow-md transition hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-base-200">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-content">
                    <FaStar />
                    {restaurant.rating}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-1 text-lg font-bold text-base-content">
                    {restaurant.name}
                  </h3>
                  <p className="mb-3 text-sm text-base-content">
                    {restaurant.description}
                  </p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {restaurant.cuisines.map((cuisine) => (
                      <span
                        key={cuisine}
                        className="rounded bg-primary px-2 py-1 text-xs capitalize text-primary-content"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto border-t border-base-200 pt-3">
                    <Link
                      to="/order-now"
                      className="block w-full rounded-lg bg-primary px-4 py-2 text-center font-semibold text-primary-content transition hover:opacity-90"
                    >
                      Explore Menu
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-base-content md:text-4xl">
              Cravings by the Numbers
            </h2>
            <p className="text-lg text-base-content">
              See why millions trust us for their daily food delivery needs
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label, description], index) => (
              <div
                key={label}
                className="rounded-lg bg-base-100 p-8 text-center shadow-md transition hover:shadow-lg"
              >
                <div
                  className={`mb-2 text-4xl font-bold md:text-5xl ${
                    index % 2 ? "text-(--color-accent)" : "text-primary"
                  }`}
                >
                  {value}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-base-content">
                  {label}
                </h3>
                <p className="text-base-content">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-base-content md:text-4xl">
              What Our Customers Say
            </h2>
            <p className="text-lg text-base-content">
              Real feedback from real food lovers
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="rounded-lg bg-base-100 p-8 shadow-md transition hover:shadow-lg"
              >
                <div className="mb-4 flex gap-1 bg-warningg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed text-base-content">
                  "{item.text}"
                </p>
                <div>
                  <h3 className="font-bold text-base-content">
                    {item.name}
                  </h3>
                  <p className="text-sm text-secondary">{item.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-6 py-14 text-center">
        <h2 className="mb-3 text-3xl font-bold text-white">
          Ready to satisfy your cravings?
        </h2>
        <p className="mx-auto mb-6 max-w-md text-white/80">
          Join thousands of happy customers ordering their favourite meals every day.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register/customer"
            className="rounded-md bg-base-100 px-8 py-3 font-semibold text-primary transition hover:bg-orange-100"
          >
            Get Started
          </Link>
          <Link
            to="/contact"
            className="rounded-md border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-base-100/10"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
