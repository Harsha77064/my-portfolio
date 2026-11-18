import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Credentials from "./sections/Credentials";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <div className="relative isolate text-white">
      <div className="page-bg" aria-hidden="true" />
      <Loader />
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Credentials />
      <Contact />
    </div>
  );
}