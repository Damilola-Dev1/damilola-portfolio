import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

// ---------------------------------------------------------------------------
// DEMO CONTENT. Everything marked below is a placeholder so you can see the
// layout.
// 1. Replace the reviews in REVIEWS with real ones (with the client's OK).
// 2. GOOGLE_URL: your Google Business Profile link. GOOGLE_RATING: the rating
//    Google really shows. Leave GOOGLE_URL as "" to hide the link.
// 3. BOOKING_URL: your booking link (for example a Calendly link). It opens
//    when someone taps "Can we book a call?" in the chat.
// 4. Set DEMO to false to remove the "Demo content" note.
// ---------------------------------------------------------------------------
const DEMO = true;
const GOOGLE_URL = "https://example.com";
const GOOGLE_RATING = "5.0";
const BOOKING_URL = "https://example.com";

type Review = {
  name: string;
  role: string; // what you built for them
  text: string; // their words, shown in the chat
  quote: string; // a short line that pops out beside the phone
  pill: { side: "left" | "right"; top: string; extra?: string; rotate: number };
};

const REVIEWS: Review[] = [
  {
    name: "Demo Client A",
    role: "Business website",
    text: "Demo review. Replace this with what a real client said about the website you built for them.",
    quote: "Demo quote: clear and reliable",
    pill: { side: "left", top: "16%", rotate: -5 },
  },
  {
    name: "Demo Client B",
    role: "Web app",
    text: "Demo review. A few lines is a good length. It can be a little longer than the first one, so you can see how the chat bubble grows to fit the words.",
    quote: "Demo quote: easy to work with",
    pill: { side: "right", top: "30%", extra: "1rem", rotate: 4 },
  },
  {
    name: "Demo Client C",
    role: "Landing page",
    text: "Demo review. Replace this with another real client's words.",
    quote: "Demo quote: delivered on time",
    pill: { side: "left", top: "54%", extra: "2.5rem", rotate: 3 },
  },
  {
    name: "Demo Client D",
    role: "Business website",
    text: "Demo review. Short and sweet works too.",
    quote: "Demo quote: highly recommend",
    pill: { side: "right", top: "72%", rotate: -4 },
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
  {
    label: "Can we book a call?",
    reply: "Sure. Pick a time that suits you.",
    action: { label: "Book a call", href: BOOKING_URL, external: true },
  },
];

type Msg = { id: number; from: "me" | "bot"; text: string; action?: Action };

const N = REVIEWS.length;

// Half the phone's width (w-80 = 20rem) plus a gap, so the pills sit beside it
const PHONE_HALF = "10rem";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Star({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="currentColor"
    >
      <polygon points="10,1.5 12.6,7.1 18.7,7.8 14.2,12 15.4,18 10,15 4.6,18 5.8,12 1.3,7.8 7.4,7.1" />
    </svg>
  );
}

function Stars() {
  return (
    <span aria-hidden="true" className="flex gap-0.5 text-vermilion">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} />
      ))}
    </span>
  );
}

function pillStyle(p: Review["pill"]): CSSProperties {
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
            className="text-[0.9rem] font-semibold leading-snug"
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

export default function Reviews() {
  const [reduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  // 0 = empty chat, 1..N = that many reviews shown, N + 1 = closing bubble too
  const [shown, setShown] = useState(reduced ? N + 1 : 0);
  const [typing, setTyping] = useState(false);
  const [fading, setFading] = useState(false);
  // once someone taps a button or types, the automatic chat stops
  const [interacted, setInteracted] = useState(false);
  const [convo, setConvo] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [announce, setAnnounce] = useState("");
  const idRef = useRef(0);
  const replyTimers = useRef<number[]>([]);

  // The automatic chat: typing dots, review, pause, next review, repeat
  useEffect(() => {
    if (reduced || interacted) return;
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
          await wait(1000); // "typing..." dots
          setTyping(false);
          setShown(i + 1);
          await wait(3000); // time to read
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
    };
  }, [reduced, interacted]);

  useEffect(() => {
    const timers = replyTimers.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Adds what the visitor said, then Damilola's answer a moment later
  const send = (userText: string, botText: string, action?: Action) => {
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
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
              What clients say
            </h2>
            <p className="mt-5 max-w-xl text-lg text-sand md:text-xl">
              Reviews from people I've built for.
            </p>
            {DEMO && (
              <p className="mt-4 inline-block rounded-full border border-sand/40 px-4 py-1.5 text-sm text-sand">
                Demo content. Replace the reviews and links in Reviews.tsx
                before you publish.
              </p>
            )}
          </div>

          {GOOGLE_URL && (
            <a
              href={GOOGLE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start font-semibold underline decoration-vermilion decoration-2 underline-offset-4 md:self-auto"
            >
              <Star className="h-4 w-4 text-vermilion" />
              {GOOGLE_RATING} on Google
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>

        {/* the same reviews as a plain list, for screen readers */}
        <ul className="sr-only">
          {REVIEWS.map((r) => (
            <li key={r.name}>
              {r.text} {r.name}, {r.role}. 5 out of 5 stars.
            </li>
          ))}
        </ul>

        <div className="relative mt-14 md:mt-20">
          {/* quote pills: wide screens only, decoration */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 hidden lg:block ${fade}`}
          >
            {REVIEWS.map(
              (r, i) =>
                shown > i && (
                  <div
                    key={r.name}
                    className="absolute"
                    style={pillStyle(r.pill)}
                  >
                    <div className="pill-in">
                      <span className="pill-bob inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink">
                        <Star className="h-3.5 w-3.5 text-vermilion" />
                        {r.quote}
                      </span>
                    </div>
                  </div>
                ),
            )}
          </div>

          {/* phone */}
          <div
            role="group"
            aria-label="Chat with Damilola"
            className="relative mx-auto w-full max-w-[20rem] rounded-[2.6rem] bg-sand p-2.5"
          >
            <div className="relative flex h-[34rem] flex-col overflow-hidden rounded-[2.1rem] bg-paper text-ink">
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink"
              />

              <div className="bg-forest px-5 pb-3 pt-10 text-paper">
                <p className="font-display text-lg font-bold">
                  Client messages
                </p>
                <p className="text-xs text-sand">{N} reviews</p>
              </div>

              {/* the chat */}
              <div
                className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-3 py-3"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0, #000 2.5rem)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0, #000 2.5rem)",
                }}
              >
                <div className={`flex flex-col gap-3 ${fade}`}>
                  {REVIEWS.slice(0, shown).map((r) => (
                    <div
                      key={r.name}
                      aria-hidden="true"
                      className="chat-in flex items-end gap-2"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest text-[0.65rem] font-bold text-paper">
                        {initials(r.name)}
                      </span>
                      <div className="min-w-0 rounded-2xl rounded-bl-md border border-ink/10 bg-sand/45 px-3.5 py-3">
                        <p className="text-[0.85rem] leading-relaxed">
                          {r.text}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem]">
                          <span className="font-semibold">{r.name}</span>
                          <span className="text-forest">{r.role}</span>
                          <Stars />
                        </div>
                      </div>
                    </div>
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
                    placeholder="Start your project with me"
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
