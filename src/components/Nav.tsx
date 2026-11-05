import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
];

// Hidden at the top of the page. A floating pill slides in once you scroll.
export default function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-[opacity,transform,visibility] duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "invisible -translate-y-6 opacity-0"
      }`}
    >
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex w-full max-w-2xl items-center justify-between gap-4 rounded-full border border-sand/20 bg-ink py-2 pl-6 pr-2"
      >
        <a
          href="#top"
          className="hidden font-display text-lg font-bold tracking-tight text-paper sm:block"
        >
          Damilola
        </a>

        <ul className="ml-auto flex items-center gap-4 text-sm md:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sand transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="block rounded-full bg-paper px-5 py-2 font-semibold text-ink transition-colors hover:bg-sand"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
