import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";

export default function App() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero />
      <About />
    </div>
  );
}