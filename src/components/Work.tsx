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
//   path is just the file name, for example "/pwesh.jpg". It is shown at its
//   full width inside a small browser window. With no image, a simple empty
//   browser window is drawn instead.

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
    url: "https://cedars-school-admin.vercel.app/",
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
    name: "Oluwakorede's Portfolio",
    text: "A portfolio website for a content writer and community manager.",
    url: "https://oluwakorede-eunice-portfolio.netlify.app/",
    image: "/oluwakorede.png",
  },
  {
    name: "Expense Tracker",
    text: "A ledger-style expense tracker where you add, edit and delete entries, with input checks.",
    tools: ["JavaScript", "HTML", "CSS"],
    url: "https://damilola-dev1.github.io/expense-tracker/",
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
              <article className="grid h-[27rem] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-3xl border border-ink/20 shadow-[0_-14px_24px_-18px_rgba(21,19,15,0.45)] md:h-[26rem] md:grid-cols-[2fr_3fr] md:grid-rows-[minmax(0,1fr)]">
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

                {/* screenshot side. On phones the text above takes only the
                    room it needs and the screenshot fills the rest of the
                    card, so there is no empty gap. From md up it fills the
                    side of the card. */}
                <div className="relative min-h-0 bg-forest md:border-l md:border-paper/10">
                  <div className="absolute inset-3 flex items-center justify-center md:inset-10">
                    {/* the screenshot shows at its full width inside a small
                        browser window, so nothing is cut off at the sides.
                        Hover (or tap) gives it a gentle zoom. */}
                    <div className="group/shot relative max-h-full w-full overflow-hidden rounded-lg bg-paper ring-1 ring-paper/15 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.6)]">
                      {p.image ? (
                        <>
                          <div
                            aria-hidden="true"
                            className="flex items-center gap-1.5 border-b border-ink/10 bg-paper px-3 py-2"
                          >
                            <span className="h-2 w-2 rounded-full bg-forest/30" />
                            <span className="h-2 w-2 rounded-full bg-forest/30" />
                            <span className="h-2 w-2 rounded-full bg-forest/30" />
                          </div>
                          <img
                            src={p.image}
                            alt={`Screenshot of ${p.name}`}
                            loading="lazy"
                            decoding="async"
                            className="block h-auto w-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover/shot:scale-[1.04]"
                          />
                        </>
                      ) : (
                        <div className="relative aspect-[16/10]">
                          <EmptyBrowser />
                        </div>
                      )}
                      {/* tapping the screenshot opens the site too. The
                          "Visit site" button is the main link, so this one
                          is hidden from keyboards and screen readers. */}
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          tabIndex={-1}
                          aria-hidden="true"
                          className="absolute inset-0"
                        />
                      )}
                    </div>
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
