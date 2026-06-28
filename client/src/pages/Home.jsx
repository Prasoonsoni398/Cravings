import { useNavigate } from "react-router-dom";
import bgimg1 from "../assets/images/bgImage1-BgVBBcls.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      data-carousel='{
        "loadingClasses": "opacity-0",
        "isAutoPlay": true,
        "interval": 3000,
        "dotsItemClasses": "carousel-box carousel-active:bg-primary"
      }'
      className="relative w-full"
    >
      {/* Carousel */}
      <div className=" h-[90vh]">
        {/* Slide 1 */}

        <img
          src={bgimg1}
          alt="Food Banner 1"
          className="h-full w-full object-cover brightness-60"
        />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="w-full max-w-5xl px-6 text-center text-white">
          <h1 className="text-5xl font-bold lg:text-6xl">
            Your Favourite Food
            <br />
            Delivered Fast
          </h1>

          <p className="mt-4 text-lg text-white/90">
            Order from thousands of restaurants and get it delivered to your
            doorstep.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="btn btn-primary px-8"
            >
              Sign Up
            </button>

            <button
              onClick={() => navigate("/order-now")}
              className="btn bg-white text-primary hover:bg-primary hover:text-white"
            >
              Order Now
            </button>
          </div>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-2xl">
            <label className="input input-bordered flex items-center bg-white shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                />
              </svg>

              <input
                type="text"
                className="grow text-black"
                placeholder="Search restaurants or dishes..."
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
