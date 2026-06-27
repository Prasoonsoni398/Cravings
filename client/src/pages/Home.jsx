import { useNavigate } from "react-router-dom";
import bgimg1 from "../assets/images/bgImage1-BgVBBcls.jpg";
import bgimg2 from "../assets/images/bgImage2-CSvQeVNX.jpg";
import bgimg3 from "../assets/images/bgImage3-BTY6Sz_K.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="herosection">
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={bgimg1}
              className="d-block w-100 carousel-img dull-img"
              alt="Food Banner 1"
            />
          </div>

          <div className="carousel-item">
            <img
              src={bgimg2}
              className="d-block w-100 carousel-img dull-img"
              alt="Food Banner 2"
            />
          </div>

          <div className="carousel-item">
            <img
              src={bgimg3}
              className="d-block w-100 carousel-img dull-img"
              alt="Food Banner 3"
            />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="w-100 herocontent d-grid justify-content-center">
        <div className="text-center text-white d-grid gap-1 vw-100">
          <h1 className="fw-bold display-5">
            Your Favourite Food, <br />
            Delivered Fast
          </h1>

          <p className="fw-bold fs-6">
            Order from thousands of restaurants and get it delivered to your
            doorstep
          </p>

          <div className="herolinks d-flex flex-wrap gap-2 justify-content-center">
            <button
              className="btn px-4 py-2 mx-4"
              id="signUp"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>

            <button
              className="btn px-4 py-2"
              id="orderNow"
              onClick={() => navigate("/order-now")}
            >
              Order Now
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className="search d-flex border rounded align-items-center p-1 mt-5">
            <i className="bi bi-search fw-bold ps-2"></i>

            <input
              type="text"
              name="menuSearch"
              id="menuSearch"
              className="menuSearch form-control bg-transparent border-0 shadow-none"
              placeholder="Search restaurants or dishes..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;