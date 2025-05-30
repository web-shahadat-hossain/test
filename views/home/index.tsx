import React from "react";
import HeroSection from "./components/hero-section";
import BrandsSection from "./components/brands-section";
import WorksSection from "./components/works-section";
import CtaSection from "./components/cta-section";
// import OffersSection from "./components/offers-section";
import BlogsSection from "./components/blogs-section";
import FaqSection from "./components/faq-section";
// import TestimonialSection from "./components/testimonial-section";
import HowItWorksSection from "./components/how-it-works-section";
import ProductSection from "./components/ProductSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <BrandsSection />
      <WorksSection />
      <ProductSection />
      <CtaSection />
      {/* <OffersSection /> */}
      <BlogsSection />
      {/* <TestimonialSection /> */}
      <FaqSection />
    </>
  );
};

export default Home;
