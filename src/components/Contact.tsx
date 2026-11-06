import { useEffect, useState } from "react";
import type { FormEvent } from "react";

// ---------------------------------------------------------------------------
// FILL THESE IN. Anything you leave empty ("") is simply hidden.
//
// EMAIL          your public email, e.g. "you@gmail.com"
// LINKEDIN       your full profile link, e.g. "https://linkedin.com/in/yourname"
// WHATSAPP       your number with country code, digits only, no + or spaces,
//                e.g. "2348012345678" (Nigeria: 234 then the number without
//                the first 0)
// FORM_ENDPOINT  optional. If you make a free form at formspree.io and paste
//                its link here (https://formspree.io/f/xxxxxxxx), messages go
//                to your inbox from the page. While it is empty, pressing
//                "Send message" opens the visitor's email app with the
//                message already written to your EMAIL.
// ---------------------------------------------------------------------------
const EMAIL: string = "";
const GITHUB: string = "https://github.com/Damilola-Dev1";
const LINKEDIN: string = "";
const WHATSAPP: string = "";
const FORM_ENDPOINT: string = "";

const LINKS = [
  EMAIL && { label: "Email", href: `mailto:${EMAIL}`, external: false },
  GITHUB && { label: "GitHub", href: GITHUB, external: true },
  LINKEDIN && { label: "LinkedIn", href: LINKEDIN, external: true },
  WHATSAPP && {
    label: "WhatsApp",
    href: `https://wa.me/${WHATSAPP}`,
    external: true,
  },
].filter(Boolean) as { label: string; href: string; external: boolean }[];

type Status = "idle" | "sending" | "sent" | "error" | "opened" | "demo";

const field =
  "block w-full rounded-2xl border border-paper/30 bg-paper/5 px-5 py-3.5 text-base text-paper placeholder:text-paper/60";

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

    // No form service set up: open the visitor's email app instead
    if (!FORM_ENDPOINT) {
      if (EMAIL) {
        const subject = encodeURIComponent(`Message from ${name}`);
        const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
        window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
        setStatus("opened");
      } else {
        setStatus("demo");
      }
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
      className="bg-forest px-6 py-24 text-paper md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
          Let's work together.
        </h2>
        <p className="mt-5 text-lg text-sand md:text-xl">
          Hiring a frontend developer, or need a website for your business? Send
          me a message.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-4 text-left">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="sr-only">Your name</span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={field}
              />
            </label>
            <label>
              <span className="sr-only">Your email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
              />
            </label>
          </div>
          <label className="block">
            <span className="sr-only">Tell me about your project</span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell me about your project"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${field} resize-y`}
            />
          </label>

          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-paper px-8 py-3.5 font-semibold text-forest transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <p role="status" className="max-w-sm text-center text-sm text-sand">
              {status === "sent" && "Thank you. Your message has been sent."}
              {status === "opened" &&
                "Your email app should open with the message ready to send."}
              {status === "demo" &&
                "This form isn't connected yet. Please use one of the links below."}
              {status === "error" && "Something went wrong. Please try again."}
            </p>
          </div>
        </form>

        {LINKS.length > 0 && (
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="inline-block rounded-full border border-paper/30 px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
                >
                  {l.label}
                  {l.external && (
                    <span className="sr-only"> (opens in a new tab)</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
