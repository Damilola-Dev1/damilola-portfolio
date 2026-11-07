import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  CheckCircle,
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
const EMAIL: string = "";
const WHATSAPP: string = "2349063667585";
const GITHUB: string = "https://github.com/Damilola-Dev1";
const LINKEDIN: string =
  "https://www.linkedin.com/in/damilola-frontend-developer";
const INSTAGRAM: string = "https://www.instagram.com/theglobaldeveloper";
const X_TWITTER: string = "https://x.com/the_damilola123";
const TIKTOK: string = "https://www.tiktok.com/@theglobaldeveloper";
const FACEBOOK: string = "";
const FORM_ENDPOINT: string = "https://formspree.io/f/moeebojz";

const iconProps = { size: 20, weight: "fill" as const, "aria-hidden": true };

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
  "block w-full rounded-2xl border border-ink/55 bg-transparent px-4 py-3 text-base text-ink placeholder:text-ink/65";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  // The success popup is open whenever the form has just been sent
  const modalOpen = status === "sent";

  const closeModal = () => setStatus("idle");

  // The chat in the Reviews section can send a typed message down to here
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setMessage((m) => (m.trim() ? `${m}\n${text}` : text));
    };
    window.addEventListener("prefill-message", onPrefill);
    return () => window.removeEventListener("prefill-message", onPrefill);
  }, []);

  // Popup behaviour: focus the close button, close on Escape, keep Tab inside
  // the popup, stop the page behind it from scrolling, and give focus back to
  // the Send button when it closes.
  useEffect(() => {
    if (!modalOpen) return;

    const submitBtn = submitBtnRef.current;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setStatus("idle");
      } else if (e.key === "Tab") {
        // The close button is the only thing to focus, so keep focus on it
        e.preventDefault();
        closeBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      submitBtn?.focus();
    };
  }, [modalOpen]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorText("");

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
        // Formspree explains what went wrong, e.g. { errors: [{ message }] }
        let detail = "";
        try {
          const data = await res.json();
          if (Array.isArray(data?.errors) && data.errors[0]?.message) {
            detail = String(data.errors[0].message);
          }
        } catch {
          // ignore: fall back to the general message
        }
        setErrorText(
          detail ||
            "The message could not be sent. Please check your details and try again.",
        );
        setStatus("error");
      }
    } catch {
      setErrorText(
        "Could not reach the server. Please check your internet connection and try again.",
      );
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="rounded-t-[2.5rem] bg-paper px-6 py-20 text-ink md:rounded-t-[4rem] md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
          Let's work together.
        </h2>
        <p className="mt-4 text-base text-ink/85 md:text-xl">
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
              rows={4}
              placeholder="Tell me about your project"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${field} resize-y`}
            />
          </label>

          <button
            ref={submitBtnRef}
            type="submit"
            disabled={status === "sending"}
            className="mt-2 w-full rounded-full bg-forest px-10 py-3.5 text-base font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          {/* Errors: shown clearly, with another way to reach me */}
          {status === "error" && (
            <div
              role="alert"
              className="w-full rounded-2xl border border-ink/30 bg-ink/5 px-4 py-3 text-center text-sm text-ink"
            >
              <p className="font-semibold">Your message was not sent.</p>
              <p className="mt-1 text-ink/85">{errorText}</p>
              {WHATSAPP && (
                <p className="mt-1 text-ink/85">
                  You can also{" "}
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline underline-offset-2"
                  >
                    message me on WhatsApp
                  </a>
                  .
                </p>
              )}
            </div>
          )}

          {(status === "opened" || status === "demo") && (
            <p
              role="status"
              className="max-w-sm text-center text-sm text-ink/85"
            >
              {status === "opened" &&
                "Your email app should open with the message ready to send."}
              {status === "demo" &&
                "This form isn't connected yet. Please use one of the links below."}
            </p>
          )}
        </form>

        {LINKS.length > 0 && (
          <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 text-ink transition-colors hover:bg-ink/20"
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

      {/* Success popup */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 px-6 py-6"
          onMouseDown={(e) => {
            // Click (or tap) on the dark area outside the card closes it
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sent-title"
            aria-describedby="sent-desc"
            className="w-full max-w-sm rounded-3xl bg-paper p-7 text-center text-ink shadow-2xl"
          >
            <CheckCircle
              size={56}
              weight="fill"
              aria-hidden="true"
              className="mx-auto text-forest"
            />
            <h3
              id="sent-title"
              className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight"
            >
              Message sent
            </h3>
            <p id="sent-desc" className="mt-3 text-base text-ink/85">
              Thank you. I have your message and I will reply as soon as I can.
            </p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeModal}
              className="mt-6 w-full rounded-full bg-forest px-10 py-3.5 text-base font-semibold text-paper transition-transform hover:-translate-y-0.5"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
