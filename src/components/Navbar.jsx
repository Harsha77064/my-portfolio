import { navLinks, profile } from "../constants";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-ink/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-white">
        <a href="#home" className="flex items-center gap-3 text-lg font-semibold">
          <img
            src={profile.avatar}
            alt=""
            width="36"
            height="36"
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-violet-400/60"
          />
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
