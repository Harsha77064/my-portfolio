import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Credentials from "./sections/Credentials";

export default function App() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <section id="projects" className="px-6 py-24 md:px-20">
        <h2 className="text-3xl font-bold md:text-5xl">Projects</h2>
        <p className="mt-4 text-white/60">Coming next</p>
      </section>
      <Skills />
      <Credentials />
      <section id="contact" className="px-6 py-24 md:px-20">
        <h2 className="text-3xl font-bold md:text-5xl">Contact</h2>
        <p className="mt-4 text-white/60">Coming next</p>
      </section>
    </div>
  );
}