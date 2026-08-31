import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Writing } from "@/components/Writing";
import { Contact } from "@/components/Contact";

export default function Page() {
  return (
    <>
      <div aria-hidden="true" className="backdrop" />
      <main className="mx-auto max-w-3xl px-6 pb-24">
        <Hero />
        <Stats />
        <About />
        <Experience />
        <Writing />
        <Contact />
      </main>
    </>
  );
}
