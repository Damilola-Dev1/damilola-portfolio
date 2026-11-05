import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
            <p className="reveal font-mono text-sm uppercase tracking-widest text-forest md:text-base">
              Meet Damilola
            </p>
            <h2 className="reveal mt-4 font-display text-3xl font-extrabold leading-[1.2] tracking-tight md:text-5xl md:leading-[1.08]">
              A developer with a{" "}
              <span className="relative inline-block whitespace-nowrap">
                business mind
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-vermilion md:-bottom-2 md:h-3"
                >
                  <path
                    d="M2 8 C 40 2, 80 12, 120 6 S 180 4, 198 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>{" "}
              and a curiosity for technology.
            </h2>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/85">
              <p className="reveal">
                I’m Damilola Samuel, a frontend developer based in Lagos,
                Nigeria. I build responsive websites and practical web
                applications using React, JavaScript and TypeScript.
              </p>
              <p className="reveal">
                My background in Business Administration, combined with
                experience in customer support and operations, influences how I
                approach development. I think beyond the interface, considering
                the people using a product, the business behind it and the
                problems it needs to solve.
              </p>
              <p className="reveal">
                I also enjoy making technology easier to understand by
                explaining technical ideas in plain language.
              </p>
            </div>

            <Link
              to="/more-about"
              className="reveal group mt-10 inline-flex items-center gap-3 text-xl font-semibold text-forest underline decoration-vermilion decoration-2 underline-offset-8 transition-colors hover:text-vermilion md:text-2xl"
            >
              More about me
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-2"
              >
                <span className="nudge inline-block">→</span>
              </span>
            </Link>
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
