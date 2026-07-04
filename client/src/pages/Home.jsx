import HeroSection from "../components/home/HeroSection";
import FeaturedRestaurants from "../components/home/FeaturedRestaurants";
import StatsSection from "../components/home/StatsSection";
import Testimonials from "../components/home/Testimonials";
import PartnerSection from "../components/home/PartnerSection";

function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedRestaurants />
      <StatsSection />
      <Testimonials />
      <PartnerSection />
    </main>
  );
}

export default Home;
