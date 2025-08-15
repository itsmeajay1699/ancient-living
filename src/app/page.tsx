import CategoryGrid from "./components/CategoryGrid";
import ContactUs from "./components/contact-us-form";
import HeroBanner from "./components/HeroBanner";
import MaxContainer from "./components/MaxContainer";
import NaturalCollection from "./components/NaturalCollection";
import OurProducts from "./components/OurProducts";
import TestimonialCarousel from "./components/testimonial";
import TopSellersSection from "./components/TopSellersSection";
import WhyChooseUs from "./components/WhyChooseUs";

export default function Home() {

  return <>
    <HeroBanner />
    <MaxContainer>
      <section className="bg-stone-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium text-gray-800 tracking-wide">
              About <span className="font-serif font-medium text-[#C75545]">Botanical Bloom</span>
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-[#C75545] to-[#D17B6F] mx-auto mt-6 mb-4"></div>
            <p className="text-lg text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Rediscovering the wisdom of nature through time-honored traditions and conscious living.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-medium text-gray-800 border-b pb-3 mb-4">Our Philosophy</h3>
              <p className="text-gray-700 leading-8 font-medium">
                We believe your body deserves what nature intended—clean, honest, and effective care. At <span className="font-medium">Botanical Bloom</span>, our journey began with a love for botanicals and a deep respect for ancient wisdom.
              </p>
              <p className="text-gray-700 leading-8 font-medium">
                Each product we craft is a quiet rebellion against chemical-laden routines. Free from harmful additives and full of natural goodness, our offerings are designed to restore not just your skin, but your sense of balance and connection to the Earth.
              </p>
              <p className="text-gray-700 leading-8 font-medium">
                Whether it’s skincare, lifestyle, or wellness, we create with care, so your rituals feel like acts of love, not chores.
              </p>
            </div>

            <div className="relative h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-[#F9EBE9] rounded-full transform -rotate-12"></div>
              <p className="relative text-3xl md:text-4xl font-serif text-[#A54235] text-center leading-snug p-8">
                "Nurturing wellness with the purity of nature."
              </p>
            </div>
          </div>
        </div>
      </section>
      <WhyChooseUs />
      <TopSellersSection />
      <CategoryGrid />
      <TestimonialCarousel />
      <NaturalCollection />
      <ContactUs />
    </MaxContainer>
  </>
}
