// Two bands cross like an X. Words slide along each one in an endless loop.
// The bands are decoration only (aria-hidden). The hidden list at the bottom
// is what screen readers get.

const TECH = [
  "React",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Tailwind",
  "Firebase",
  "Firestore",
  "Authentication",
  "REST APIs",
  "CRUD",
  "Git",
  "GitHub",
  "Netlify",
  "WordPress",
];

const BUSINESS = [
  "Problem-solving",
  "Business Understanding",
  "Customer Support",
  "Operations",
];

const GROUPS = [
  {
    title: "Frontend",
    skills: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind"],
  },
  {
    title: "Backend & Data",
    skills: ["Firebase", "Firestore", "Authentication", "CRUD"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "REST APIs", "Netlify", "WordPress"],
  },
  {
    title: "Professional",
    skills: [
      "Problem-solving",
      "Business Understanding",
      "Customer Support",
      "Operations",
    ],
  },
];

type BandProps = {
  words: string[];
  repeat: number; // how many times the list is repeated inside one half
  direction: "left" | "right";
  duration: string; // time for one full loop. Bigger = slower
  tilt: string; // Tailwind rotate class
  layer: string; // Tailwind z-index class
  position: string; // Tailwind top class: where the band sits in the wrapper
  bandClass: string; // colours of the band
  dotClass: string; // colour of the dots between words
};

function Band({
  words,
  repeat,
  direction,
  duration,
  tilt,
  layer,
  position,
  bandClass,
  dotClass,
}: BandProps) {
  const half = Array.from({ length: repeat }, () => words).flat();

  return (
    <div
      className={`marquee-band absolute left-1/2 w-[130vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden py-4 md:py-5 ${position} ${tilt} ${layer} ${bandClass}`}
    >
      <div
        className={`marquee-track flex w-max ${
          direction === "left" ? "marquee-left" : "marquee-right"
        }`}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {/* the same list twice, so the loop has no jump */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {half.map((word, i) => (
              <li
                key={`${copy}-${i}`}
                className="flex items-center whitespace-nowrap font-display text-2xl font-bold tracking-tight md:text-4xl"
              >
                {word}
                <span
                  className={`mx-6 inline-block h-2.5 w-2.5 rounded-full md:mx-10 md:h-3 md:w-3 ${dotClass}`}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="overflow-hidden bg-ink px-6 py-10 text-paper md:px-10 md:py-24"
    >
      {/* the crossing bands. Compact on phones, full size on laptops. */}
      <div aria-hidden="true" className="relative -mx-6 h-48 md:-mx-10 md:h-80">
        {/* back band: business skills, paper, slides right.
            On phones it sits lower, so its words are not covered. */}
        <Band
          words={BUSINESS}
          repeat={3}
          direction="right"
          duration="20s"
          tilt="rotate-[4deg] md:rotate-3"
          layer="z-10"
          position="top-[70%] md:top-1/2"
          bandClass="bg-paper text-ink"
          dotClass="bg-vermilion"
        />
        {/* front band: technical skills, forest, slides left.
            On phones it sits higher. */}
        <Band
          words={TECH}
          repeat={1}
          direction="left"
          duration="32s"
          tilt="-rotate-[4deg] md:-rotate-3"
          layer="z-20 shadow-[0_18px_28px_-16px_rgba(0,0,0,0.7)] border-y border-sand/20"
          position="top-[30%] md:top-1/2"
          bandClass="bg-forest text-paper"
          dotClass="bg-sand"
        />
      </div>

      {/* full skills list for screen readers only. Nothing changes on screen */}
      <div className="sr-only">
        <h2>Skills</h2>
        <ul>
          {GROUPS.map((group) => (
            <li key={group.title}>
              {group.title}: {group.skills.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
