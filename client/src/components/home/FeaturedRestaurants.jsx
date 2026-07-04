import { FaStar, FaArrowRight } from "react-icons/fa";

const restaurants = [
  {
    name: "Under The Mango Tree",
    image:
      "https://res.cloudinary.com/dpl3xwf1z/image/upload/v1775671325/restaurants/69c58f340d577beee548c195/njneiftngfspzpn2wdig.avif",
    cuisine: ["Indian", "Chinese", "Italian"],
    rating: "4.8",
    description:
      "Enjoy the thrill of grill and barbecue at Under The Mango Tree restaurant at Jehan Numa Palace, Bhopal. Head here now!",
  },
  {
    name: "Raj Darbar",
    image:
      "https://res.cloudinary.com/dpl3xwf1z/image/upload/v1774557305/restaurants/69c58f4b0d577beee548c198/fpdlv1viy4gucm1vrh7u.webp",
    cuisine: ["Indian", "Mughlai"],
    rating: "4.1",
    description:
      "Raj Darbar is a one-of-a-kind Indian restaurant that offers a unique dining experience for families and friends with a dhaba-style theme.",
  },
  {
    name: "Countryside Culture",
    image:
      "https://res.cloudinary.com/dpl3xwf1z/image/upload/v1774557446/restaurants/69c590150d577beee548c19b/htwjijdrr2gbjdaf355s.webp",
    cuisine: ["Indian", "Chinese"],
    rating: "3.6",
    description:
      "A hidden gem away from the city, offering lush green meadows and peaceful walking paths for relaxation.",
  },
];

function FeaturedRestaurants() {
  return (
    <section className="bg-base-200 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-3xl font-bold uppercase text-primary">
              Featured Restaurants
            </p>
            <h2 className="mt-4 text-lg text-base-content ">
              3 restaurants available
            </h2>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
            <article
              key={restaurant.name}
              className="card card-compact overflow-hidden group rounded-xl border border-base-200 bg-base-100 shadow-2xl transition-transform duration-500 hover:scale-102"
            >
              <div className="relative overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-50 w-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute right-4 top-4 rounded-full bg-warning px-4 py-2 text-sm font-semibold text-base-100 shadow-lg">
                  <FaStar className="mr-2 inline-block text-xs" />
                  {restaurant.rating}
                </div>
              </div>

              <div className="card-body space-y-2 px-6 py-4">
                <div>
                  <h3 className="text-2xl font-semibold text-base-content">
                    {restaurant.name}
                  </h3>
                  <p className=" text-sm  pt-2 text-base-content/70">
                    {restaurant.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {restaurant.cuisine.map((item) => (
                    <span
                      key={item}
                      className="badge border border-primary/30 text-primary bg-primary/10 text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <button className="btn btn-primary ">
                  Explore Menu 
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedRestaurants;
