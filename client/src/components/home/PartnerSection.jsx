import { useNavigate } from "react-router-dom";
import { FaStore } from "react-icons/fa";

function PartnerSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-base-200 py-20 px-6">
      <div className="hero">
        <div className="hero-content w-full max-w-7xl">
          <div className="card w-full bg-primary text-primary-content shadow-2xl">
            <div className="card-body flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              {/* Left Content */}
              <div className="max-w-3xl">
                <div className="badge badge-outline border-primary-content text-primary-content mb-5 px-4 py-3">
                  Become a Restaurant Partner
                </div>

                <h2 className="text-4xl font-bold lg:text-5xl">
                  Grow your business with Cravings
                </h2>

                <p className="mt-5 text-lg opacity-90">
                  Join thousands of restaurants already delivering with
                  Cravings. Reach more customers, increase your sales,
                  and manage your restaurant with our easy-to-use platform.
                </p>
              </div>

              {/* Right Button */}
              <div>
                <button
                  onClick={() => navigate("/register")}
                  className="btn btn-lg bg-base-100 text-primary border-none hover:bg-base-200"
                >
                  <FaStore />
                  Partner With Us
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnerSection;