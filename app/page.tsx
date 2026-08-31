import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Writing } from "@/components/Writing";
import { Contact } from "@/components/Contact";

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24">
      <Hero />
      <About />
      <Experience />
      <Writing />
      <Contact />
    </main>
  );
}
