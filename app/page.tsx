import { AboutInnocraft } from "@/components/sections/about-innocraft";
import { Benefits } from "@/components/sections/benefits";
import { ClassInfo } from "@/components/sections/class-info";
import { Contact } from "@/components/sections/contact";
import { FinalCta } from "@/components/sections/final-cta";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Mentor } from "@/components/sections/mentor";
import { Opportunities } from "@/components/sections/opportunities";
import { Projects } from "@/components/sections/projects";
import { Testimonials } from "@/components/sections/testimonials";
import { WhyMinecraft } from "@/components/sections/why-minecraft";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <div className="bg-websiteBg">
      <Navbar />
      <main id="home">
        {/* Replace intro video here */}
        {/* Replace mentor image here */}
        {/* Replace gallery images here */}
        {/* Replace project links here */}
        <Hero />
        <WhyMinecraft />
        <AboutInnocraft />
        <Mentor />
        <Projects />
        <Gallery />
        <Benefits />
        <Opportunities />
        <Testimonials />
        <ClassInfo />
        <FinalCta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
