import Navbar from "./components/Navbar";
import { profile } from "./constants";

export default function App() {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <section id="home" className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">{profile.name}</h1>
        <p className="mt-4 text-white/70">{profile.title}</p>
      </section>
      <section id="about" className="flex min-h-screen items-center justify-center">
        <p>About goes here</p>
      </section>
    </div>
  );
}