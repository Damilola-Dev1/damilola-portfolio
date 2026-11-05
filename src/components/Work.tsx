// Project cards that stack: as you scroll, each card slides up and lands on
// top of the one before it. This works on phones, tablets and desktops.
// Every card on a phone has the same height on purpose, so a shorter card
// never leaves the edge of a taller one showing underneath it.
//
// HOW TO EDIT
// - Change, add or delete entries in PROJECTS below.
// - `url` is optional. With no url, the button is hidden.
// - `linkLabel` is optional. The button says "Visit site" unless you set it,
//   for example "View code" for a GitHub link.
// - `tools` is optional. With no tools, the "Built with" line is hidden.
// - `image` is optional. The screenshot sits in the public folder, so the
//   path is just the file name, for example "/pwesh.jpg". With no image, a
//   simple empty browser window is drawn instead.

import type { CSSProperties } from "react";

type Project = {
  name: string;
  text: string;
  tools?: string[];
  url?: string;
  linkLabel?: string;
  image?: string;
};

const PROJECTS: Project[] = [
  {
    name: "Cedars School Admin",
    text: "A school management app with separate dashboards for admins, teachers, bursars, parents and students.",
    tools: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    // no link yet: add url: "https://..." when the app is live
    image: "/cedars.jpg",
  },
  {
    name: "The Reformers Nation Community App",
    text: "A community app for registering and managing members, with announcements and admin dashboards.",
    tools: ["React", "TypeScript", "Firebase"],
    url: "https://reformers-community-app.web.app/login",
    image: "/reformers.jpg",
  },
  {
    name: "Pwesh Beauty Hub",
    text: "A landing page for a beauty training business.",
    url: "https://pwesh-beauty-hub.netlify.app/",
    image: "/pwesh.jpg",
  },
  {
    name: "Expense Tracker",
    text: "A ledger-style expense tracker where you add, edit and delete entries, with input checks.",
    tools: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/Damilola-Dev1/expense-tracker",
    linkLabel: "View code",
    image: "/expense-tracker.jpg",
  },
];

const list = new Intl.ListFormat("en-GB", {
  style: "long",
  type: "conjunction",
});

// Shown when a project has no screenshot yet
function EmptyBrowser() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-paper">
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
              className="sticky top-[calc(5.5rem_+_var(--i)_*_0.5rem)] mb-8 md:top-[calc(6rem_+_var(--i)_*_0.75rem)]"
              // each card sticks a little lower than the last, so the edges
              // of the cards underneath stay visible
              style={{ "--i": i } as CSSProperties}
            >
              <article className="grid h-[28rem] grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-3xl border border-ink/20 shadow-[0_-14px_24px_-18px_rgba(21,19,15,0.45)] md:h-[26rem] md:grid-cols-[2fr_3fr] md:grid-rows-[minmax(0,1fr)]">
                {/* text side */}
                <div className="flex min-h-0 flex-col bg-forest p-5 text-paper md:p-10">
                  <h3 className="font-display text-2xl font-extrabold leading-[1.02] tracking-tight md:text-4xl">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-sm text-sand md:mt-4 md:text-lg">
                    {p.text}
                  </p>

                  <div className="mt-auto pt-5 md:pt-8">
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
                        className="mt-3 inline-flex items-center gap-2 rounded-full md:mt-4 bg-paper px-5 py-2.5 text-sm font-semibold text-forest transition-transform hover:-translate-y-0.5"
                      >
                        {p.linkLabel ?? "Visit site"}
                        <span aria-hidden="true" className="text-vermilion">
                          ↗
                        </span>
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* screenshot side. On phones the screenshot sits in a wide
                    box so none of it is cut off; from md up it fills the
                    side of the card. */}
                <div className="relative min-h-0 bg-sand p-3 md:p-0">
                  <div className="relative aspect-[2.2/1] overflow-hidden rounded-lg shadow-[0_12px_24px_-12px_rgba(21,19,15,0.35)] md:absolute md:inset-10 md:aspect-auto">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={`Screenshot of ${p.name}`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 block h-full w-full object-cover object-top"
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
