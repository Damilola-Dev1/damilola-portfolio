import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Opening photo at the top of the page (you at your laptop).
// The file lives in the `public` folder (public/moreinfo2.jpeg).
const OPENING_SRC = "/moreinfo2.jpeg";

// Second photo, shown in the "What I enjoy building" section.
// It reuses the photo from the home page (public/about.jpg).
// Set this to "" to leave the photo out.
const WORKING_SRC = "/about.jpg";

const JOURNEY = [
  {
    year: "2022",
    title: "WordPress",
    text: "My interest in the web started here. It showed me how an idea could become something people can actually use online.",
  },
  {
    year: "2023 – 2025",
    title: "HTML, CSS and JavaScript",
    text: "I began learning web development more deeply, one layer at a time. A broken laptop forced a pause along the way, but I picked it back up.",
  },
  {
    year: "2026",
    title: "React and TypeScript",
    text: "I became more interested in building interactive interfaces and applications.",
  },
  {
    year: "Today",
    title: "Beyond static pages",
    text: "Authentication, database operations, application functionality and deployment, using tools such as Firebase alongside my frontend stack.",
  },
];

const QUESTIONS = [
  "Who is it for?",
  "What problem should it solve?",
  "What does the business or organisation need from it?",
  "What should visitors or users be able to do?",
];

// Each card has one or more links.
// `href` opens a live site in a new tab. `to` is a link inside this site.
type BuildLink =
  | { label: string; href: string }
  | { label: string; to: string };

type Build = {
  title: string;
  text: string;
  links: BuildLink[];
};

const BUILDS: Build[] = [
  {
    title: "Websites for businesses",
    text: "Responsive websites that help businesses present their services, establish credibility and make it easier for potential customers to get in touch.",
    links: [
      {
        label: "See Pwesh Beauty Hub",
        href: "https://pwesh-beauty-hub.netlify.app/",
      },
    ],
  },
  {
    title: "Web applications",
    text: "Functional applications that solve practical problems, organise information and simplify everyday processes for individuals, communities and organisations.",
    links: [
      {
        label: "See Reformers",
        href: "https://reformers-community-app.web.app/login",
      },
      // Cedars has no live link yet, so this scrolls to the Projects section.
      // When it is live, replace `to: "/#work"` with `href: "https://..."`.
      { label: "See Cedars School Admin", to: "/#work" },
    ],
  },
];

const buildLinkClass =
  "group inline-flex items-center gap-3 text-xl font-semibold text-forest underline decoration-vermilion decoration-2 underline-offset-8 transition-colors hover:text-vermilion md:text-2xl";

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-300 group-hover:translate-x-2"
    >
      <span className="nudge inline-block">→</span>
    </span>
  );
}

export default function MoreAbout() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.set(".reveal", { opacity: 0, y: 28 });
      ScrollTrigger.batch(".reveal", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.1,
          }),
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef}>
      {/* 1. OPENING */}
      <section className="bg-paper px-6 pb-20 pt-32 text-ink md:px-10 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/#about"
            className="reveal inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-forest transition-colors hover:text-vermilion md:text-base"
          >
            <span aria-hidden="true" className="nudge-left inline-block">
              ←
            </span>
            Back to home
          </Link>

          <div className="mt-10 grid items-center gap-12 md:grid-cols-[4fr_6fr] md:gap-20">
            <div className="reveal relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl bg-sand shadow-[0_24px_40px_-24px_rgba(21,19,15,0.4)]">
              <img
                src={OPENING_SRC}
                alt="Damilola Samuel"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="reveal font-mono text-xs uppercase tracking-widest text-forest">
                More about me
              </p>
              <h1 className="reveal mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
                The person behind the{" "}
                <span className="relative inline-block">
                  code
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-3 w-full text-vermilion"
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
                </span>
                .
              </h1>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/85">
                <p className="reveal">
                  I’m Damilola Samuel, a frontend developer based in Lagos,
                  Nigeria. I build websites and web applications using React,
                  JavaScript and TypeScript, with a focus on making them useful,
                  accessible and straightforward to use.
                </p>
                <p className="reveal">
                  My journey into technology didn’t begin with a traditional
                  computer science background. I studied Business
                  Administration, and that experience has shaped how I think
                  about technology, people and the problems worth solving.
                </p>
                <p className="reveal">
                  I believe good development is about more than writing code.
                  It’s about understanding what people need, why a product
                  exists and how technology can make things work better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MY JOURNEY */}
      <section className="bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="reveal font-mono text-xs uppercase tracking-widest text-sand">
            How I got into development
          </p>
          <h2 className="reveal mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
            My journey
          </h2>

          <ol className="mt-14 border-l-2 border-sand/30">
            {JOURNEY.map((step) => (
              <li
                key={step.title}
                className="reveal relative pb-12 pl-8 last:pb-0 md:pl-12"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-ink bg-vermilion"
                />
                <p className="font-mono text-xs uppercase tracking-widest text-vermilion">
                  {step.year}
                </p>
                <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl text-lg leading-relaxed text-paper/80">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>

          <p className="reveal mt-14 max-w-xl text-lg leading-relaxed text-paper/80">
            I’m still learning, experimenting and improving, but my focus has
            remained the same: becoming a developer who can take an idea and
            turn it into something people can use.
          </p>
        </div>
      </section>

      {/* 3. BUSINESS MEETS TECHNOLOGY */}
      <section className="bg-paper px-6 py-24 text-ink md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="reveal font-mono text-xs uppercase tracking-widest text-forest">
            A business mind behind the code
          </p>
          <h2 className="reveal mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
            Purpose first, then pixels.
          </h2>
          <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-ink/85">
            My degree in Business Administration gives me a different
            perspective. Before thinking about how a website should look or how
            an application should function, I try to understand the purpose
            behind it.
          </p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUESTIONS.map((q, i) => (
              <li
                key={q}
                className="reveal rounded-2xl border border-ink/80 p-6"
              >
                <p className="font-mono text-xs text-forest">0{i + 1}</p>
                <p className="mt-6 font-display text-xl font-extrabold leading-tight tracking-tight">
                  {q}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
            <p className="reveal text-lg leading-relaxed text-ink/85">
              These questions matter because a website should do more than exist
              online. It should communicate clearly, build confidence and help
              people take action. The same goes for web applications: I pay
              attention to the processes behind them, how information is
              organised and how the people using them will interact with the
              system.
            </p>
            <div className="reveal space-y-5 text-lg leading-relaxed text-ink/85">
              <p>
                My professional experience also includes administration,
                customer support and operations. Those roles taught me the
                importance of communication, attention to detail, understanding
                people’s needs and keeping things organised.
              </p>
              <p>
                I carry those lessons into development. I want the things I
                build to make sense to the people using them, not just to the
                person writing the code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT I BUILD */}
      <section className="bg-sand px-6 py-24 text-ink md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div
            className={`grid items-center gap-12 md:gap-20 ${
              WORKING_SRC ? "md:grid-cols-[4fr_6fr]" : ""
            }`}
          >
            {WORKING_SRC && (
              <div className="reveal relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl bg-paper shadow-[0_24px_40px_-24px_rgba(21,19,15,0.4)]">
                <img
                  src={WORKING_SRC}
                  alt="Damilola Samuel"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}

            <div>
              <p className="reveal font-mono text-xs uppercase tracking-widest text-forest">
                What I enjoy building
              </p>
              <h2 className="reveal mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
                Two closely related things.
              </h2>
              <p className="reveal mt-6 max-w-md text-lg leading-relaxed text-ink/85">
                Whether it’s a business website or a web application, I care
                about the experience behind the interface and the purpose the
                product is meant to serve.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {BUILDS.map((b) => (
              <div
                key={b.title}
                className="reveal flex flex-col rounded-3xl bg-paper p-8 md:p-10"
              >
                <h3 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
                  {b.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-ink/85">
                  {b.text}
                </p>
                <div className="mt-8 flex flex-col items-start gap-4">
                  {b.links.map((l) =>
                    "href" in l ? (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className={buildLinkClass}
                      >
                        {l.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                        <Arrow />
                      </a>
                    ) : (
                      <Link key={l.label} to={l.to} className={buildLinkClass}>
                        {l.label}
                        <Arrow />
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BEYOND THE SCREEN */}
      <section className="bg-paper px-6 py-24 text-ink md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="reveal font-mono text-xs uppercase tracking-widest text-forest">
            Beyond the screen
          </p>
          <p className="reveal mt-6 font-display text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            I enjoy explaining technology in{" "}
            <span className="relative inline-block whitespace-nowrap">
              plain language
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-vermilion"
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
            </span>
            .
          </p>
          <p className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-ink/85">
            People shouldn’t have to understand all the technical details to
            appreciate what technology can help them accomplish.
          </p>
        </div>
      </section>

      {/* 6. CLOSING */}
      <section className="bg-forest px-6 py-24 text-paper md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="reveal font-mono text-xs uppercase tracking-widest text-sand">
            What I’m working towards
          </p>
          <h2 className="reveal mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
            Understanding, building, testing and improving.
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-paper/85">
            <p className="reveal">
              I’m continuing to grow as a frontend developer, taking on
              meaningful projects and strengthening my technical skills. I’m
              interested in working with teams where I can contribute, learn and
              grow, as well as collaborating with businesses and individuals who
              need thoughtful web experiences.
            </p>
            <p className="reveal">
              I bring a business perspective to technology, a practical mindset
              to development and a genuine curiosity about what can be built
              next. If you have an idea, a project or a problem you think
              technology can help solve, I’d be glad to hear about it.
            </p>
          </div>
          <div className="reveal mt-10 flex flex-wrap gap-3">
            <Link
              to="/#contact"
              className="rounded-full bg-vermilion px-8 py-4 text-base font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              Work with me
            </Link>
            <Link
              to="/#work"
              className="rounded-full border border-paper/40 px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-paper/10"
            >
              See my work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
