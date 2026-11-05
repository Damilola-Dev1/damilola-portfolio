import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 1. Put a second photo in the `public` folder (for example public/about.jpg)
// 2. Set this to "/about.jpg"
const ABOUT_SRC = "/about.jpg";

const ROLES = [
  {
    title: "Frontend Developer",
    text: "React and TypeScript interfaces for teams that are hiring.",
  },
  {
    title: "Web Builder",
    text: "Complete websites for small businesses, from first idea to launch.",
  },
  {
    title: "Tech Creator",
    text: "Technology explained in plain language, so nobody feels left out.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".reveal", {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-paper px-6 py-24 text-ink md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-14 md:grid-cols-[5fr_6fr] md:gap-20">
          {/* photo */}
          <div className="reveal relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-sand shadow-[0_24px_40px_-24px_rgba(21,19,15,0.4)]">
            {ABOUT_SRC ? (
              <img
                src={ABOUT_SRC}
                alt="Damilola Samuel at work"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full text-forest/30"
              >
                <circle cx="50" cy="38" r="17" fill="currentColor" />
                <path
                  d="M14 100c2-26 17-40 36-40s34 14 36 40z"
                  fill="currentColor"
                />
              </svg>
            )}
          </div>

          {/* story */}
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-widest text-forest">
              Meet Damilola
            </p>
            <h2 className="reveal mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              Built with a{" "}
              <span className="relative inline-block">
                business
                {/* double hand-drawn underline */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                  className="absolute -bottom-3 left-0 h-4 w-full text-vermilion"
                >
                  <path
                    d="M2 6 C 40 1, 80 11, 120 5 S 180 3, 198 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d="M22 16 C 55 11, 90 19, 125 14 S 165 12, 182 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>{" "}
              mind.
            </h2>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/85">
              <p className="reveal">
                I'm Damilola, a frontend developer based in Lagos. I build React
                and TypeScript interfaces that are clear, quick and easy to use.
              </p>
              <p className="reveal">
                My background is in Business Administration, so I think about
                what a website has to do for the person who owns it: bring in
                customers, build trust and be simple to run.
              </p>
              <p className="reveal">
                Outside client work, I explain technology in plain language, so
                the people who rely on it understand what it can do for them.
              </p>
            </div>
          </div>
        </div>

        {/* roles: big titles, hover turns them vermilion and slides them right */}
        <ul className="mt-20 border-b border-ink/80 md:mt-28">
          {ROLES.map((role) => (
            <li
              key={role.title}
              className="reveal group grid items-center gap-3 border-t border-ink/80 py-8 md:grid-cols-[1.3fr_1fr] md:gap-10 md:py-10"
            >
              <h3 className="font-display text-4xl font-extrabold leading-none tracking-tight transition-[color,transform] duration-300 group-hover:text-vermilion motion-safe:group-hover:translate-x-4 md:text-6xl">
                {role.title}
              </h3>
              <p className="max-w-sm text-lg text-ink transition-transform duration-300 motion-safe:group-hover:translate-x-4 md:text-xl">
                {role.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
