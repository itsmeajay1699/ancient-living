import CategoryGrid from "./components/CategoryGrid";
import HeroBanner from "./components/HeroBanner";
import MaxContainer from "./components/MaxContainer";
import TestimonialCarousel from "./components/testimonial";
import TopSellersSection from "./components/TopSellersSection";

export default function Home() {

  return <>
    <HeroBanner />
    <div className="px-6 py-[100px] w-full md:max-w-2/4 text-center mx-auto">
      <h1 className="text-3xl font-bold">Ancient Living</h1>
      <p className="text-xl font-bold mt-8">
        Ancient Living is an eco-conscious, alternate lifestyle brand stemming from the roots.
        Conceptualized and created by combining the virtues of ancient wisdom and time-tested remedies to
        accomplish healthy and sustainable living.
      </p>
    </div>
    <MaxContainer>
      <TopSellersSection />
      <CategoryGrid />
      <TestimonialCarousel />
    </MaxContainer>
  </>
}
