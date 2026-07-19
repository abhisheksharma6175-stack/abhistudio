import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Services from "@/components/home/Services";
import OfferBanner from "@/components/home/OfferBanner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BestSeller from "@/components/home/BestSeller";
import Testimonials from "@/components/home/Testimonials";
import InstagramGallery from "@/components/home/InstagramGallery";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyChooseUs />
      <Services />
      <OfferBanner />
      <FeaturedProducts />
      <BestSeller />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}