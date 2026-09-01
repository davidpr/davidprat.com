import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Skills } from "@/components/Skills";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Certifications } from "@/components/Certifications";
import { Languages } from "@/components/Languages";
import { Writing } from "@/components/Writing";
import { Contact } from "@/components/Contact";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "David Prat Robles",
  alternateName: "David Prat",
  url: "https://davidprat.com",
  image: "https://davidprat.com/avatar.jpg",
  jobTitle: "Engineering Leader — AI Infrastructure & LLM Platforms",
  worksFor: { "@type": "Organization", name: "Finlooker" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Universitat Politècnica de Catalunya" },
    { "@type": "CollegeOrUniversity", name: "La Salle BCN" },
    { "@type": "CollegeOrUniversity", name: "EAE Business School" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" },
  sameAs: [
    "https://www.linkedin.com/in/davidpratrobles/",
    "https://www.youtube.com/@davidpratr",
    "https://finlooker.io",
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div aria-hidden="true" className="backdrop" />
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:max-w-4xl">
        <Hero />
        <Stats />
        <Skills />
        <About />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <Languages />
        <Writing />
        <Contact />
      </main>
    </>
  );
}
