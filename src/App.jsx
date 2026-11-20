import { MotionConfig } from "motion/react";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Credentials from "./sections/Credentials";
import Contact from "./sections/Contact";
import Approach from "./sections/Approach";
import Footer from "./sections/Footer";

export default function App() {
  return (
    // reducedMotion="user" turns Motion's movement off for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
      <div className="relative isolate text-white">
        <div className="page-bg" aria-hidden="true" />
        <Loader />
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Approach />
        <Skills />
        <Credentials />
        <Contact />
        <Footer />
      </div>
    </MotionConfig>
  );
}