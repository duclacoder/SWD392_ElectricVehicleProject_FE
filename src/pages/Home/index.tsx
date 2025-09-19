import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { Header } from "../../Widgets/Headers/Header.tsx";
import FeaturesSession from "./ui/FeaturesSession.tsx";
import { HeroSection } from "./ui/HeroSection.tsx";
import MarketComponent from "./ui/MarketComponent.tsx";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSession />
      <MarketComponent />
      <Footer />
    </>
  );
};

export default HomePage;
