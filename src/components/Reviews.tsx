import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

// ---------------------------------------------------------------------------
// PROJECT NOTES. Damilola explains each project in his own words, in the
// phone chat. There are no client quotes here. When a real client gives you a
// quote (with their OK), you can add it as another item in NOTES.
//
// BOOKING_URL: your booking link (for example a Calendly link). While it is
// empty, the "Can we book a call?" button is hidden.
// ---------------------------------------------------------------------------
const BOOKING_URL: string = "";

type Note = {
  name: string; // project name
  role: string; // what kind of project it is
  text: string; // Damilola's words, shown in the chat
  badge: string; // a short line that pops out beside the phone
  pill: { side: "left" | "right"; top: string; extra?: string; rotate: number };
};

const NOTES: Note[] = [
  {
    name: "Cedars School Admin",
    role: "School admin app",
    text: "I built an admin system for a school. Fee payments get a numbered receipt, absent students are flagged for follow-up, and results are published only after the administrator approves them.",
    badge: "Fees, attendance and results",
    pill: { side: "left", top: "16%", rotate: -5 },
  },
  {
    name: "The Reformers Nation",
    role: "Community app",
    text: "A community app where new members register and a leader approves them first. Members then see their next meeting and assignments, and leaders manage members and post announcements. Real members use it.",
    badge: "Used by real members",
    pill: { side: "right", top: "30%", extra: "1rem", rotate: 4 },
  },
  {
    name: "Pwesh Beauty Hub",
    role: "Landing page",
    text: "A landing page for a beauty training business. It is live, and real visitors use it.",
    badge: "Live landing page",
    pill: { side: "left", top: "54%", extra: "2.5rem", rotate: 3 },
  },
  {
    name: "Expense Tracker",
    role: "Web app",
    text: "A ledger-style expense tracker in plain JavaScript, HTML and CSS. You add, edit and delete entries, and it checks your inputs. It is being used to track real expenses.",
    badge: "Tracking real expenses",
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

// Half the phone's width (w-80 = 20rem) plus a gap, so the pills sit beside it
const PHONE_HALF = "10rem";

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

// One project note: Damilola's portrait, green bubble, project name above
function NoteBubble({ note }: { note: Note }) {
  return (
    <div aria-hidden="true" className="chat-in flex items-end gap-2">
      <img
        src="/portrait.png"
        alt=""
        className="h-8 w-8 shrink-0 rounded-full bg-sand object-cover object-[50%_0%]"
      />
      <div className="min-w-0 rounded-2xl rounded-bl-md bg-forest px-3.5 py-3 text-paper">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-sand">
          {note.name} · {note.role}
        </p>
        <p className="mt-1.5 text-[0.85rem] leading-relaxed">{note.text}</p>
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
          await wait(4500); // time to read
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
        <div>
          <h2 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
            Project notes
          </h2>
          <p className="mt-5 max-w-xl text-lg text-sand md:text-xl">
            What each project does, in my own words.
          </p>
        </div>

        {/* the same notes as a plain list, for screen readers */}
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
                <p className="font-display text-lg font-bold">Project notes</p>
                <p className="text-xs text-sand">{N} projects</p>
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
