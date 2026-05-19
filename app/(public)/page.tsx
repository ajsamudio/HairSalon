import Hero from "@/components/sections/Hero";
import OfferStrip from "@/components/sections/OfferStrip";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";
import About from "@/components/sections/About";
import Reviews from "@/components/sections/Reviews";
import InstagramFeed from "@/components/sections/InstagramFeed";
import BookingSection from "@/components/sections/BookingSection";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <OfferStrip />
      <Services />
      <Gallery />
      <About />
      <Reviews />
      <InstagramFeed />
      <BookingSection />
      <FAQ />
      <Contact />
    </>
  );
}
