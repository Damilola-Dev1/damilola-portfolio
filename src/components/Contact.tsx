import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  EnvelopeSimple,
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
  WhatsappLogo,
  XLogo,
} from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// FILL THESE IN. Anything you leave empty ("") is simply hidden, so you only
// need the ones you use.
//
// EMAIL          your public email, e.g. "you@gmail.com"
// WHATSAPP       your number with country code, digits only, no + or spaces,
//                e.g. "2348012345678" (Nigeria: 234, then the number without
//                the first 0)
// The others     the full link to your profile, starting with https://
// FORM_ENDPOINT  optional. If you make a free form at formspree.io and paste
//                its link here (https://formspree.io/f/xxxxxxxx), messages go
//                to your inbox from the page. While it is empty, pressing
//                "Send message" opens the visitor's email app with the
//                message already written to your EMAIL.
// ---------------------------------------------------------------------------
const EMAIL: string = "thedamilola123@gmail.com";
const WHATSAPP: string = "2349063667585";
const GITHUB: string = "https://github.com/Damilola-Dev1";
const LINKEDIN: string = "www.linkedin.com/in/damilola-frontend-developer";
const INSTAGRAM: string =
  "https://www.instagram.com/theglobaldeveloper?vrfl=NGQ2OHBramVoNWY5&utm_source=qr";
const X_TWITTER: string =
  "https://x.com/the_damilola123?s=11&t=n88-u6fX-XvRa9ZEJnNGKQ";
const TIKTOK: string =
  "https://www.tiktok.com/@theglobaldeveloper?_r=1&_t=ZS-9BAukW09W68";
const FACEBOOK: string = "";
const FORM_ENDPOINT: string = "";

const iconProps = { size: 26, weight: "fill" as const, "aria-hidden": true };

const ALL_LINKS = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    external: false,
    icon: <EnvelopeSimple {...iconProps} />,
  },
  {
    label: "WhatsApp",
    value: WHATSAPP,
    href: `https://wa.me/${WHATSAPP}`,
    external: true,
    icon: <WhatsappLogo {...iconProps} />,
  },
  {
    label: "Instagram",
    value: INSTAGRAM,
    href: INSTAGRAM,
    external: true,
    icon: <InstagramLogo {...iconProps} />,
  },
  {
    label: "Facebook",
    value: FACEBOOK,
    href: FACEBOOK,
    external: true,
    icon: <FacebookLogo {...iconProps} />,
  },
  {
    label: "X",
    value: X_TWITTER,
    href: X_TWITTER,
    external: true,
    icon: <XLogo {...iconProps} />,
  },
  {
    label: "GitHub",
    value: GITHUB,
    href: GITHUB,
    external: true,
    icon: <GithubLogo {...iconProps} />,
  },
  {
    label: "TikTok",
    value: TIKTOK,
    href: TIKTOK,
    external: true,
    icon: <TiktokLogo {...iconProps} />,
  },
  {
    label: "LinkedIn",
    value: LINKEDIN,
    href: LINKEDIN,
    external: true,
    icon: <LinkedinLogo {...iconProps} />,
  },
];

const LINKS = ALL_LINKS.filter((l) => l.value);

type Status = "idle" | "sending" | "sent" | "error" | "opened" | "demo";

const field =
  "block w-full rounded-2xl border border-ink/30 bg-transparent px-5 py-4 text-base text-ink placeholder:text-ink/60";

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
      className="rounded-t-[2.5rem] bg-paper px-6 py-24 text-ink md:rounded-t-[4rem] md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
          Let's work together.
        </h2>
        <p className="mt-5 text-lg text-ink/85 md:text-xl">
          Hiring a frontend developer, or need a website for your business? Send
          me a message.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 flex flex-col items-center gap-4 text-left"
        >
          <div className="grid w-full gap-4 sm:grid-cols-2">
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
          <label className="block w-full">
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

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 w-full rounded-full bg-forest px-10 py-4 text-lg font-bold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          <p role="status" className="max-w-sm text-center text-sm text-ink/85">
            {status === "sent" && "Thank you. Your message has been sent."}
            {status === "opened" &&
              "Your email app should open with the message ready to send."}
            {status === "demo" &&
              "This form isn't connected yet. Please use one of the links below."}
            {status === "error" && "Something went wrong. Please try again."}
          </p>
        </form>

        {LINKS.length > 0 && (
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/10 text-ink transition-colors hover:bg-ink/20"
                >
                  {l.icon}
                  <span className="sr-only">
                    {l.label}
                    {l.external ? " (opens in a new tab)" : ""}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
