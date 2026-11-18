import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";

export default function App() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero />
      <section id="about" className="flex min-h-screen items-center justify-center">
        <p>About goes here</p>
      </section>
    </div>
  );
}