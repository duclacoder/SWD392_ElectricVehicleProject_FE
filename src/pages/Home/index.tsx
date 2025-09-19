import React from "react";
import { Header } from "../../Widgets/Headers/Header.tsx";
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { HeroSection } from "./ui/HeroSection.tsx";
import FeaturesSession from "./ui/FeaturesSession.tsx";
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
