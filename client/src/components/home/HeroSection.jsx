import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import bgimg1 from "../../assets/images/bgImage1-BgVBBcls.jpg";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero h-[90vh] relative overflow-hidden">
      {/* Background Image */}
      <img
        src={bgimg1}
        alt="Fresh Food"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Hero Content */}
      <div className="hero-content relative z-10 w-full  justify-center px-6 flex items-center h-[90vh] text-white">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="text-5xl text-center font-bold border-base-100  text-white">
            Your Favourite Food, <br />
            Delivered Fast
          </div>

          {/* Description */}
          <p className="mt-6 text-xl leading-tight ">
            Order from thousands of restaurants and get it delivered to your doorstep
          </p>

          

          {/* Buttons */}
          <div className="mt-8 flex justify-center  gap-4">
            <button
              onClick={() => navigate("/register")}
              className="btn btn-primary"
            >
              Sign Up
            </button>

            <button
              onClick={() => navigate("/order-now")}
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
            >
              Order Now
              <FaArrowRight />
            </button>
          </div>

          {/* Search */}
          <div className="card mt-10 max-w-2xl">
            <div className="card-body p-0">

              <label className="input bg-white  flex items-center gap-3">

                <FaSearch className="text-primary" />

                <input
                  type="text"
                  placeholder="Search restaurants or dishes..."
                  className="grow placeholder:text-black/60"
                />

              </label>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;