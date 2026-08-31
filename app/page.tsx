import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Certifications } from "@/components/Certifications";
import { Languages } from "@/components/Languages";
import { Writing } from "@/components/Writing";
import { Contact } from "@/components/Contact";

export default function Page() {
  return (
    <>
      <div aria-hidden="true" className="backdrop" />
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:max-w-4xl">
        <Hero />
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
