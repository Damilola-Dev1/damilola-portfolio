import { useEffect, useState } from "react";
import type { FormEvent } from "react";

// ---------------------------------------------------------------------------
// DEMO CONTENT. These details are placeholders so you can see the layout.
// 1. EMAIL and LINKS: replace with your real ones. Delete any link you
//    don't use.
// 2. FORM_ENDPOINT: the form needs a service to deliver messages to your
//    inbox. Make a free form at formspree.io, copy its link (it looks like
//    https://formspree.io/f/xxxxxxxx) and paste it here. While it is empty,
//    the form is a demo and sends nothing.
// 3. Set DEMO to false to remove the "Demo details" note.
// ---------------------------------------------------------------------------
const DEMO = true;
const EMAIL = "hello@example.com";
const FORM_ENDPOINT = "";

const LINKS = [
  {
    label: "GitHub",
    text: "github.com/demo-username",
    href: "https://example.com",
  },
  {
    label: "LinkedIn",
    text: "linkedin.com/in/demo-username",
    href: "https://example.com",
  },
  { label: "WhatsApp", text: "+234 000 000 0000", href: "https://example.com" },
];

type Status = "idle" | "sending" | "sent" | "error" | "demo";

const field =
  "mt-2 block w-full rounded-2xl border border-ink/40 bg-transparent px-5 py-3.5 text-base text-ink";
const rowLink =
  "group grid items-baseline gap-1 py-4 sm:grid-cols-[6.5rem_1fr] sm:gap-4";
const rowValue =
  "break-words text-lg font-semibold underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-300 group-hover:decoration-vermilion md:text-xl";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // The chat in the Reviews section can send a typed message down to here
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setMessage((m) => (m.trim() ? `${m}\n${text}` : text));
    };
    window.addEventListener("prefill-message", onPrefill);
    return () => window.removeEventListener("prefill-message", onPrefill);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!FORM_ENDPOINT) {
      setStatus("demo");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="bg-paper px-6 py-24 text-ink md:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[5fr_6fr] md:gap-20">
        {/* left: words and direct links */}
        <div>
          <h2 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
            Let's work together.
          </h2>
          <p className="mt-5 max-w-md text-lg text-ink/85 md:text-xl">
            Hiring a frontend developer, or need a website for your business?
            Send me a message.
          </p>
          {DEMO && (
            <p className="mt-4 inline-block rounded-full border border-ink/30 px-4 py-1.5 text-sm text-ink/80">
              Demo details. Replace them in Contact.tsx before you publish.
            </p>
          )}

          <ul className="mt-10 border-b border-ink/80">
            <li className="border-t border-ink/80">
              <a href={`mailto:${EMAIL}`} className={rowLink}>
                <span className="font-semibold text-forest">Email</span>
                <span className={rowValue}>{EMAIL}</span>
              </a>
            </li>
            {LINKS.map((l) => (
              <li key={l.label} className="border-t border-ink/80">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={rowLink}
                >
                  <span className="font-semibold text-forest">{l.label}</span>
                  <span className={rowValue}>
                    {l.text}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* right: the form */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block font-semibold">
              Your name
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={field}
              />
            </label>
            <label className="block font-semibold">
              Your email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
              />
            </label>
          </div>
          <label className="block font-semibold">
            Tell me about your project
            <textarea
              name="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${field} resize-y`}
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-forest px-8 py-3.5 font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <p role="status" className="max-w-sm text-sm text-ink/85">
              {status === "demo" &&
                "Demo form: nothing was sent. Add your form link in Contact.tsx to receive real messages."}
              {status === "sent" && "Thank you. Your message has been sent."}
              {status === "error" && (
                <>
                  Something went wrong. Please try again, or email me at{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="font-semibold underline"
                  >
                    {EMAIL}
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
