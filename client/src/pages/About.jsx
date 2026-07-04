import { Link } from "react-router-dom";
import { FaHeart, FaLeaf, FaShieldAlt, FaStar, FaStore, FaUsers } from "react-icons/fa";

const values = [
  {
    icon: <FaHeart className="text-3xl text-primary" />,
    title: "Passion for Food",
    desc: "We believe great food brings people together. Every order is crafted with care.",
  },
  {
    icon: <FaLeaf className="text-3xl text-primary" />,
    title: "Fresh & Local",
    desc: "We partner with local restaurants to bring you the freshest meals from your neighborhood.",
  },
  {
    icon: <FaShieldAlt className="text-3xl text-primary" />,
    title: "Safe & Reliable",
    desc: "Secure payments, real-time tracking, and verified riders for every delivery.",
  },
];

const team = [
  ["Sofia Reyes", "CEO & Co-Founder", "SR"],
  ["Marcus Lim", "CTO & Co-Founder", "ML"],
  ["Aisha Patel", "Head of Operations", "AP"],
  ["James Owusu", "Head of Design", "JO"],
];

const About = () => {
  return (
    <main className="bg-base-100">
      <section className="relative flex h-[60vh] items-center justify-center bg-[url('/aboutPage.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative z-10 px-6 text-center">
          <img src="/assets/circleLogo-DpCri5UD.png" alt="Cravings" className="mx-auto mb-4 h-20 w-20" />
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            About <span className="text-primary">Cravings</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/80">
            Connecting hungry hearts with amazing food, one delivery at a time.
          </p>
        </div>
      </section>

      <section className="bg-(--color-neutral) py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {[
            ["50K+", "Happy Customers"],
            ["1,200+", "Partner Restaurants"],
            ["3,500+", "Active Riders"],
            ["4.8", "Average Rating"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-primary">
                {label === "Average Rating" && <FaStar className="mb-1 inline bg-warningg" />} {value}
              </p>
              <p className="mt-1 text-sm text-(--color-neutral-content)">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Our Story
          </p>
          <h2 className="mb-4 text-3xl font-bold leading-snug text-(--color-neutral)">
            Born from a love of great food
          </h2>
          <p className="mb-4 leading-relaxed text-secondary">
            Cravings started in 2022 when three food lovers realized that finding and ordering from local restaurants was harder than it needed to be.
          </p>
          <p className="leading-relaxed text-secondary">
            Today, we help restaurants reach new customers, riders build flexible livelihoods, and customers get delicious meals straight to their door.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            [<FaStore />, "Restaurants", "Diverse cuisines from local gems"],
            [<FaUsers />, "Riders", "Fast, reliable delivery partners"],
            [<FaHeart />, "Partners", "Businesses that grow with us"],
            [<FaStar />, "Community", "People at the heart of everything"],
          ].map(([icon, label, desc]) => (
            <div key={label} className="flex flex-col gap-2 rounded-xl border border-(--color-base-300) bg-base-100 p-5 shadow-sm">
              <span className="text-2xl text-primary">{icon}</span>
              <p className="font-bold text-(--color-neutral)">{label}</p>
              <p className="text-xs text-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-base-200 px-6 py-16">
        <div className="mx-auto mb-10 max-w-5xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            What We Stand For
          </p>
          <h2 className="text-3xl font-bold text-(--color-neutral)">Our Core Values</h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-xl border border-(--color-base-300) bg-base-100 p-8 text-center shadow-sm">
              <div className="mb-4 flex justify-center">{value.icon}</div>
              <h3 className="mb-2 text-lg font-bold text-(--color-neutral)">{value.title}</h3>
              <p className="text-sm leading-relaxed text-secondary">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            The People Behind Cravings
          </p>
          <h2 className="text-3xl font-bold text-(--color-neutral)">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {team.map(([name, role, initials]) => (
            <div key={name} className="text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-md">
                {initials}
              </div>
              <p className="font-bold text-(--color-neutral)">{name}</p>
              <p className="text-sm text-secondary">{role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary px-6 py-14 text-center">
        <h2 className="mb-3 text-3xl font-bold text-white">Ready to satisfy your cravings?</h2>
        <p className="mx-auto mb-6 max-w-md text-white/80">
          Join thousands of happy customers ordering their favourite meals every day.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register/customer" className="rounded-md bg-base-100 px-8 py-3 font-semibold text-primary hover:bg-orange-100">
            Get Started
          </Link>
          <Link to="/contact" className="rounded-md border-2 border-white px-8 py-3 font-semibold text-white hover:bg-base-100/10">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
