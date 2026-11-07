import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

// ---------------------------------------------------------------------------
// REVIEWS. Words from clients who read the wording and agreed to have it on
// this site. The Expense Tracker is a personal project, so it is Damilola's
// own words and is labelled that way. Only add a new review here when the
// client has given their OK.
//
// BOOKING_URL: your booking link (for example a Calendly link). While it is
// empty, the "Can we book a call?" button is hidden.
// ---------------------------------------------------------------------------
const BOOKING_URL: string = "https://calendly.com/thedamilola123/30min";

// How long each review stays before the next one starts typing (milliseconds)
const READ_TIME = 3000;

type Note = {
  name: string; // project name
  initials: string; // two letters shown in the round avatar
  kind: "review" | "own"; // a client review, or Damilola's own words
  role: string; // what kind of project it is
  text: string; // the review (or Damilola's words for the personal project)
  badge: string; // a short line that pops out beside the phone
  pill: { side: "left" | "right"; top: string; extra?: string; rotate: number };
};

const NOTES: Note[] = [
  {
    name: "PWESH Beauty Hub",
    initials: "PB",
    kind: "review",
    role: "Client project",
    text: "We wanted a website that would properly showcase our beauty services and training programmes, and Damilola delivered just that. I particularly like how everything is presented. Visitors can easily find what they're looking for, view our work and make enquiries. It has given us a much better online presence.",
    badge: "Live website",
    pill: { side: "left", top: "10%", rotate: -5 },
  },
  {
    name: "Reformers Community App",
    initials: "RC",
    kind: "review",
    role: "Client / community project",
    text: "Managing our community activities used to involve keeping track of several things separately. Having a platform where we can manage members, attendance, announcements and other activities has made things considerably easier. Damilola put a lot of thought into how the system works, and we appreciate having a tool that supports the way our community operates.",
    badge: "Used by real members",
    pill: { side: "right", top: "24%", extra: "1rem", rotate: 4 },
  },
  {
    name: "Cedars School Admin",
    initials: "CS",
    kind: "review",
    role: "School project",
    text: "Having the different aspects of school administration organised in one platform makes a real difference. From managing student information and tracking fee payments to monitoring attendance and academic records, the system brings everything together in a way that is easier to follow. We particularly appreciate the thought put into making the different sections accessible and straightforward to use.",
    badge: "Fees, attendance and results",
    pill: { side: "left", top: "42%", extra: "2.5rem", rotate: 3 },
  },
  {
    name: "Oluwakorede's Portfolio",
    initials: "OP",
    kind: "review",
    role: "Client project",
    text: "I love how my portfolio turned out. I wanted something that would present my work professionally without making it feel too complicated, and the final website achieved that. It looks good, is easy to navigate and gives people a better impression of what I do. I'm genuinely happy with the outcome.",
    badge: "Personal portfolio",
    pill: { side: "right", top: "58%", rotate: -4 },
  },
  {
    name: "Expense Tracker",
    initials: "ET",
    kind: "own",
    role: "Personal project, not a review",
    text: "A personal finance application designed to make tracking income and expenses simpler. It provides a straightforward way to record transactions, monitor spending and get a clearer picture of where money goes.",
    badge: "Personal project",
    pill: { side: "left", top: "76%", extra: "1rem", rotate: 4 },
  },
];

type Action = { label: string; href: string; external?: boolean };

// The quick-reply buttons at the bottom of the phone, and what Damilola
// answers when each one is tapped.
const CHIPS: { label: string; reply: string; action: Action }[] = [
  {
    label: "I need a website",
    reply:
      "Tell me about your business and what you need. Send me a message and we'll take it from there.",
    action: { label: "Send me a message", href: "#contact" },
  },
  {
    label: "I'm hiring a developer",
    reply: "Thanks for stopping by. Send me a message about the role.",
    action: { label: "Send me a message", href: "#contact" },
  },
  ...(BOOKING_URL
    ? [
        {
          label: "Can we book a call?",
          reply: "Sure. Pick a time that suits you.",
          action: {
            label: "Book a call",
            href: BOOKING_URL,
            external: true,
          },
        },
      ]
    : []),
];

type Msg = { id: number; from: "me" | "bot"; text: string; action?: Action };

const N = NOTES.length;
// the number shown under the headline counts client reviews only
const REVIEW_COUNT = NOTES.filter((n) => n.kind === "review").length;
// colours for the three overlapping avatars in the phone header
const AVATAR_TONES = [
  "bg-paper text-forest",
  "bg-sand text-ink",
  "bg-vermilion text-ink",
];

// Half the phone's width on wide screens (md:max-w-[22rem]) plus a gap, so the pills sit beside it
const PHONE_HALF = "11rem";

function pillStyle(p: Note["pill"]): CSSProperties {
  const offset = `calc(50% + ${PHONE_HALF} + 1.5rem + ${p.extra ?? "0px"})`;
  return {
    top: p.top,
    transform: `rotate(${p.rotate}deg)`,
    ...(p.side === "left" ? { right: offset } : { left: offset }),
  };
}

// A message from Damilola: portrait, green bubble, optional button inside
function BotBubble({ text, action }: { text: string; action?: Action }) {
  return (
    <div className="chat-in flex items-end gap-2">
      <img
        src="/portrait.png"
        alt=""
        className="h-8 w-8 shrink-0 rounded-full bg-sand object-cover object-[50%_0%]"
      />
      <div className="min-w-0">
        <div className="rounded-2xl rounded-bl-md bg-forest px-4 py-3 text-paper">
          <p
            aria-hidden="true"
            className="text-[0.95rem] font-semibold leading-snug"
          >
            {text}
          </p>
          {action && (
            <a
              href={action.href}
              {...(action.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-paper px-4 py-2.5 text-sm font-semibold text-forest"
            >
              {action.label}
              <span aria-hidden="true">→</span>
              {action.external && (
                <span className="sr-only">(opens in a new tab)</span>
              )}
            </a>
          )}
        </div>
        <p aria-hidden="true" className="mt-1 text-[0.7rem] font-semibold">
          Damilola
        </p>
      </div>
    </div>
  );
}

// One review: the client's round avatar, green bubble, project name underneath.
// The personal project (kind "own") keeps Damilola's portrait.
function NoteBubble({ note }: { note: Note }) {
  return (
    <div aria-hidden="true" className="chat-in flex items-end gap-2">
      {note.kind === "own" ? (
        <img
          src="/portrait.png"
          alt=""
          className="h-8 w-8 shrink-0 rounded-full bg-sand object-cover object-[50%_0%]"
        />
      ) : (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand text-[0.65rem] font-bold text-ink">
          {note.initials}
        </span>
      )}
      <div className="min-w-0">
        <div className="rounded-2xl rounded-bl-md bg-forest px-3.5 py-3.5 text-paper">
          <p className="text-[0.95rem] leading-[1.7]">{note.text}</p>
        </div>
        <p className="mt-1 text-[0.7rem] font-semibold">
          {note.name}
          <span className="font-normal text-ink/70"> · {note.role}</span>
        </p>
      </div>
    </div>
  );
}

export default function Reviews() {
  const [reduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // 0 = empty chat, 1..N = that many notes shown, N + 1 = closing bubble too
  const [shown, setShown] = useState(reduced ? N + 1 : 0);
  const [typing, setTyping] = useState(false);
  const [fading, setFading] = useState(false);
  // once someone taps a button or types, the automatic chat stops
  const [interacted, setInteracted] = useState(false);
  const [convo, setConvo] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [announce, setAnnounce] = useState("");
  // the automatic chat only plays while the phone is on screen
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const idRef = useRef(0);
  const replyTimers = useRef<number[]>([]);
  const phoneRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // true while the visitor is at the bottom of the chat (so new messages scroll into view)
  const stick = useRef(true);

  // Watch for the phone coming on screen
  useEffect(() => {
    const el = phoneRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The automatic chat: typing dots, review, pause, next review, repeat
  useEffect(() => {
    if (reduced || interacted || !inView) return;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const run = async () => {
      await wait(600);
      while (!cancelled) {
        setShown(0);
        setFading(false);
        for (let i = 0; i < N; i++) {
          setTyping(true);
          await wait(1300); // "typing..." dots
          setTyping(false);
          setShown(i + 1);
          await wait(READ_TIME); // time to read
        }
        setShown(N + 1);
        await wait(6500);
        setFading(true);
        await wait(600);
      }
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      setTyping(false);
    };
  }, [reduced, interacted, inView]);

  useEffect(() => {
    const timers = replyTimers.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Keep the newest message in view, unless the visitor scrolled up to re-read
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (reduced && !interacted) return;
    if (shown === 0) stick.current = true;
    if (!stick.current) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [shown, typing, convo, reduced, interacted]);

  const onChatScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // Adds what the visitor said, then Damilola's answer a moment later
  const send = (userText: string, botText: string, action?: Action) => {
    stick.current = true;
    if (!interacted) {
      setInteracted(true);
      setShown(N + 1);
      setFading(false);
    }
    const userId = ++idRef.current;
    const botId = ++idRef.current;
    setConvo((c) => [...c, { id: userId, from: "me", text: userText }]);
    setTyping(true);
    const t = window.setTimeout(
      () => {
        setTyping(false);
        setConvo((c) => [
          ...c,
          { id: botId, from: "bot", text: botText, action },
        ]);
        setAnnounce(botText);
      },
      reduced ? 0 : 800,
    );
    replyTimers.current.push(t);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    // the contact form further down picks this up and fills in its message box
    window.dispatchEvent(new CustomEvent("prefill-message", { detail: text }));
    setDraft("");
    send(
      text,
      "Got it. Add your name and email in the form and send it from there.",
      { label: "Go to the form", href: "#contact" },
    );
  };

  const fade = `transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`;

  return (
    <section
      id="reviews"
      className="bg-ink px-6 py-24 text-paper md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div>
          <h2 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
            Reviews
          </h2>
          <p className="mt-5 max-w-xl text-lg text-sand md:text-xl">
            What people say about working with me.
          </p>
        </div>

        {/* the same reviews as a plain list, for screen readers */}
        <ul className="sr-only">
          {NOTES.map((n) => (
            <li key={n.name}>
              {n.name}, {n.role}. {n.text}
            </li>
          ))}
        </ul>

        <div className="relative mt-14 md:mt-20">
          {/* quote pills: wide screens only, decoration */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 hidden lg:block ${fade}`}
          >
            {NOTES.map(
              (r, i) =>
                shown > i && (
                  <div
                    key={r.name}
                    className="absolute"
                    style={pillStyle(r.pill)}
                  >
                    <div className="pill-in">
                      <span className="pill-bob inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink">
                        <span className="h-2 w-2 rounded-full bg-vermilion" />
                        {r.badge}
                      </span>
                    </div>
                  </div>
                ),
            )}
          </div>

          {/* phone */}
          <div
            ref={phoneRef}
            role="group"
            aria-label="Chat with Damilola"
            className="relative mx-auto w-full max-w-[19.5rem] rounded-[2.6rem] bg-sand p-2.5 md:max-w-[22rem]"
          >
            {/* side buttons, so it reads as a phone */}
            <span
              aria-hidden="true"
              className="absolute -left-[3px] top-28 h-8 w-[3px] rounded-l bg-sand"
            />
            <span
              aria-hidden="true"
              className="absolute -left-[3px] top-40 h-14 w-[3px] rounded-l bg-sand"
            />
            <span
              aria-hidden="true"
              className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-sand"
            />
            <div className="relative flex h-[38rem] flex-col overflow-hidden rounded-[2.1rem] bg-paper text-ink md:h-[44rem]">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink"
              />

              <div className="flex items-center gap-3 bg-forest px-4 pb-3 pt-10 text-paper">
                <div aria-hidden="true" className="flex -space-x-2">
                  {NOTES.filter((n) => n.kind === "review")
                    .slice(0, 3)
                    .map((n, i) => (
                      <span
                        key={n.name}
                        className={`grid h-8 w-8 place-items-center rounded-full text-[0.65rem] font-bold ring-2 ring-forest ${AVATAR_TONES[i]}`}
                      >
                        {n.initials}
                      </span>
                    ))}
                </div>
                <div>
                  <p className="font-display text-lg font-bold">
                    Satisfied clients
                  </p>
                  <p className="text-xs text-sand">
                    {typing ? "typing…" : `${REVIEW_COUNT} reviews`}
                  </p>
                </div>
              </div>

              {/* the chat: scrolls on its own, the page behind stays still */}
              <div
                ref={scrollRef}
                onScroll={onChatScroll}
                role="region"
                aria-label="Reviews chat, scrollable"
                tabIndex={0}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-color:var(--color-forest)_transparent] [scrollbar-width:thin] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-vermilion"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0, #000 2.5rem)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0, #000 2.5rem)",
                }}
              >
                <div className="flex min-h-full flex-col justify-end gap-4 px-3 py-4">
                  <div className={`flex flex-col gap-4 ${fade}`}>
                    {NOTES.slice(0, shown).map((n) => (
                      <NoteBubble key={n.name} note={n} />
                    ))}

                    {shown > N && (
                      <BotBubble text="Your project could be next." />
                    )}
                  </div>

                  {convo.map((m) =>
                    m.from === "me" ? (
                      <div
                        key={m.id}
                        className="chat-in max-w-[85%] self-end rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-paper"
                      >
                        <p aria-hidden="true">{m.text}</p>
                      </div>
                    ) : (
                      <BotBubble key={m.id} text={m.text} action={m.action} />
                    ),
                  )}

                  {typing && (
                    <div
                      aria-hidden="true"
                      className="chat-in flex items-end gap-2"
                    >
                      <span className="h-8 w-8 shrink-0" />
                      <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-ink/10 bg-sand/45 px-4 py-3.5">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-2 w-2 animate-pulse rounded-full bg-forest"
                            style={{ animationDelay: `${d * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* quick replies and message box */}
              <div className="border-t border-ink/10">
                <div className="flex gap-2 overflow-x-auto px-3 pb-2 pt-3 [scrollbar-width:none]">
                  {CHIPS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => send(c.label, c.reply, c.action)}
                      className="shrink-0 rounded-full border border-forest px-3.5 py-1.5 text-xs font-semibold text-forest transition-colors hover:bg-forest hover:text-paper"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={onSubmit}
                  className="flex items-center gap-2 px-3 pb-3"
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    aria-label="Start your project with me"
                    placeholder="Start your project with me…"
                    className="min-w-0 flex-1 rounded-full border border-ink/25 bg-transparent px-4 py-2 text-base text-ink placeholder:text-ink/65"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-paper"
                  >
                    <span aria-hidden="true">→</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* tells screen reader users when Damilola replies */}
          <p role="status" className="sr-only">
            {announce}
          </p>
        </div>
      </div>
    </section>
  );
}
