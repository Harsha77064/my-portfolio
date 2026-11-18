import { profile, projects } from "./constants";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold">{profile.name}</h1>
      <p className="text-white/70">{profile.title}</p>
      <p className="mt-6">Projects loaded: {projects.length}</p>
    </div>
  );
}