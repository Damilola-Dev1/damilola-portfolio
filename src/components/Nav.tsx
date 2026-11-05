import { useEffect, useState } from "react";

const links = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
];

// Hidden while the hero is on screen. A floating pill appears once you scroll
// past it and stays fixed through every section.
// Phones: "Dami" plus a menu button that opens a dropdown panel.
// md and up: the links sit inside the pill.
export default function Nav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  // Show the pill only once the hero (id="top") has scrolled out of view.
  // After that it stays fixed at the top through every section.
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Close the menu if the pill hides
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  // Close the menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-5 transition-[opacity,transform,visibility] duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "invisible -translate-y-6 opacity-0"
      }`}
    >
      <div className="w-full max-w-2xl">
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex items-center justify-between gap-3 rounded-full border border-sand/20 bg-ink py-2 pl-6 pr-2.5"
        >
          <a
            href="#top"
            onClick={close}
            aria-label="Damilola Samuel, back to top"
            className="font-display text-2xl font-extrabold tracking-tight text-paper"
          >
            Dami
            <span className="text-vermilion">.</span>
          </a>

          {/* md and up: links inside the pill */}
          <ul className="hidden items-center gap-6 text-sm md:flex">
            {links.slice(1).map((link) => (
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

          {/* phones: menu button */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="relative h-11 w-11 rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20 md:hidden"
          >
            {/* two lines */}
            <span
              aria-hidden="true"
              className={`absolute left-1/2 h-[2px] rounded-full bg-current transition-all duration-300 ${
                open
                  ? "top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45"
                  : "top-[16px] w-5 -translate-x-1/2"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-[2px] rounded-full bg-current transition-all duration-300 ${
                open
                  ? "left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45"
                  : "left-[calc(50%-10px+6px)] top-[26px] w-[14px]"
              }`}
            />
          </button>
        </nav>

        {/* phones: dropdown panel, a separate rounded box under the pill */}
        <div
          id="mobile-menu"
          aria-hidden={!open}
          className={`pointer-events-auto grid transition-[grid-template-rows,opacity,visibility] duration-300 md:hidden ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "invisible grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="pt-2">
              <div className="rounded-[2rem] border border-sand/20 bg-ink px-6 pb-6 pt-5">
                <ul className="flex flex-col">
                  {links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={close}
                        className="block py-3 text-xl text-paper/90 transition-colors hover:text-vermilion"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={close}
                  className="mt-4 block rounded-full bg-paper py-3.5 text-center text-lg font-semibold text-ink transition-colors hover:bg-sand"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
