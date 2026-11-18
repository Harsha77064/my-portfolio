import { navLinks, profile } from "../constants";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-black/60 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-white">
        <a href="#home" className="text-lg font-semibold">
          {profile.name}
        </a>
        <ul className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={link.href} className="text-white/70 transition hover:text-white">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}