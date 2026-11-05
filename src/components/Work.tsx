// Project cards that stack: as you scroll, each card slides up and lands on
// top of the one before it (on tablets and desktops). On phones they simply
// sit one below the other.
//
// HOW TO EDIT
// - Change, add or delete entries in PROJECTS below.
// - `url` is optional. With no url, the "Visit site" button is hidden.
// - `tools` is optional. With no tools, the "Built with" line is hidden.
// - `image` is optional. Put the screenshot in public/projects/ and write
//   the path, for example "/projects/cedars.png". With no image, a simple
//   empty browser window is drawn instead.

type Project = {
  name: string;
  text: string;
  tools?: string[];
  url?: string;
  image?: string;
};

const PROJECTS: Project[] = [
  {
    name: "Cedars School Admin",
    text: "A school management app with separate dashboards for admins, teachers, bursars, parents and students.",
    tools: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    url: "",
    image: "",
  },
  {
    name: "The Reformers Nation Community App",
    text: "A community app for registering and managing members, with announcements and admin dashboards.",
    tools: ["React", "TypeScript", "Firebase"],
    url: "",
    image: "",
  },
  {
    name: "Expense Tracker",
    text: "A ledger-style expense tracker where you add, edit and delete entries, with input checks.",
    tools: ["JavaScript", "HTML", "CSS"],
    url: "",
    image: "",
  },
  {
    name: "Pwesh Beauty Hub",
    text: "A landing page for a beauty training business.",
    url: "",
    image: "",
  },
];

const list = new Intl.ListFormat("en-GB", {
  style: "long",
  type: "conjunction",
});

// Shown when a project has no screenshot yet
function EmptyBrowser() {
  return (
    <div aria-hidden="true" className="h-full bg-paper">
      <div className="flex items-center gap-1.5 border-b border-ink/10 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-forest/30" />
        <span className="h-2 w-2 rounded-full bg-forest/30" />
        <span className="h-2 w-2 rounded-full bg-forest/30" />
      </div>
      <div className="space-y-3 p-6">
        <div className="h-4 w-2/3 rounded bg-forest/15" />
        <div className="h-3 w-1/2 rounded bg-forest/10" />
        <div className="mt-6 h-20 rounded bg-forest/10" />
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section
      id="work"
      className="bg-paper px-6 py-24 text-ink md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
          My projects
        </h2>
        <p className="mt-5 max-w-xl text-lg text-ink/85 md:text-xl">
          Apps and sites I've built, and the tools behind each one.
        </p>

        <ul className="mt-12 md:mt-16">
          {PROJECTS.map((p, i) => (
            <li
              key={p.name}
              className="mb-8 md:sticky"
              // each card sticks a little lower than the last, so the edges
              // of the cards underneath stay visible
              style={{ top: `calc(6rem + ${i} * 0.75rem)` }}
            >
              <article className="grid overflow-hidden rounded-3xl border border-ink/20 shadow-[0_-14px_24px_-18px_rgba(21,19,15,0.45)] md:h-[26rem] md:grid-cols-[2fr_3fr] md:grid-rows-[minmax(0,1fr)]">
                {/* text side */}
                <div className="flex min-h-0 flex-col bg-forest p-8 text-paper md:p-10">
                  <h3 className="font-display text-3xl font-extrabold leading-[1.02] tracking-tight md:text-4xl">
                    {p.name}
                  </h3>
                  <p className="mt-4 text-base text-sand md:text-lg">
                    {p.text}
                  </p>

                  <div className="mt-auto pt-8">
                    {p.tools && p.tools.length > 0 && (
                      <p className="text-sm text-sand">
                        Built with {list.format(p.tools)}.
                      </p>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-forest transition-transform hover:-translate-y-0.5"
                      >
                        Visit site
                        <span aria-hidden="true" className="text-vermilion">
                          ↗
                        </span>
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* screenshot side */}
                <div className="relative h-64 min-h-0 bg-sand md:h-auto">
                  <div className="absolute inset-6 overflow-hidden rounded-lg shadow-[0_12px_24px_-12px_rgba(21,19,15,0.35)] md:inset-10">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={`Screenshot of ${p.name}`}
                        className="block h-full w-full object-cover object-top"
                      />
                    ) : (
                      <EmptyBrowser />
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
