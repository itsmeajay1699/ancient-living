import CategoryGrid from "./components/CategoryGrid";
import ContactUs from "./components/contact-us-form";
import HeroBanner from "./components/HeroBanner";
import MaxContainer from "./components/MaxContainer";
import NaturalCollection from "./components/NaturalCollection";
import OurProducts from "./components/OurProducts";
import TestimonialCarousel from "./components/testimonial";
import TopSellersSection from "./components/TopSellersSection";

export default function Home() {

  return <>
    <HeroBanner />
    <MaxContainer>
      <div className="px-6 py-[100px] w-full text-center mx-auto">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="text-lg font-medium leading-10 mt-8">
          We believe your body deserves what nature intended - clean, honest, and effective care.
          At Botanical Bloom, our journey began with a love for botanicals and a deep respect for ancient wisdom.
          Each product we craft is a quiet rebellion against chemical-laden routines and a celebration of conscious living.
          Free from harmful additives and full of natural goodness, our offerings restore not just your skin but your sense of
          balance, purpose, and connection to the Earth. Whether it’s skincare, lifestyle, or wellness, we create with care -
          so your rituals feel like acts of love, not chores.
        </p>
      </div>
      <CategoryGrid />
      <OurProducts />
      <TestimonialCarousel />
      <NaturalCollection />
      <ContactUs />
    </MaxContainer>
  </>
}
