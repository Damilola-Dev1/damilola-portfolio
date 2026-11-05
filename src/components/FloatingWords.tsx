import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";

// Half the card's width. Must match the card size in IDCard.tsx.
const CARD_HALF = "clamp(210px, 37vh, 300px) / 2";
// Smallest gap between a word and the card. Make it smaller to pull words closer.
const GAP = "2.5rem";

type Word = {
  text: string;
  side: "left" | "right";
  top: string; // % of the hero height
  extra?: string; // extra distance from the card, so the edges look uneven
  rotate: number;
  soft?: boolean; // sand instead of paper
  underline?: boolean;
};

const WORDS: Word[] = [
  { text: "Frontend", side: "left", top: "26%", rotate: -7 },
  { text: "Developer", side: "right", top: "33%", rotate: 5, soft: true },
  { text: "Web", side: "left", top: "47%", extra: "3rem", rotate: 4 },
  {
    text: "Builder",
    side: "right",
    top: "52%",
    extra: "2rem",
    rotate: -5,
    soft: true,
    underline: true,
  },
  { text: "Tech", side: "left", top: "66%", extra: "0.5rem", rotate: -4 },
  {
    text: "Creator",
    side: "right",
    top: "70%",
    extra: "0.5rem",
    rotate: 6,
    soft: true,
  },
];

// Words are placed from the centre of the page, so they stay next to the card
// whatever the screen width is.
function position(w: Word): CSSProperties {
  const offset = `calc(50% + ${CARD_HALF} + ${GAP} + ${w.extra ?? "0px"})`;
  return w.side === "left"
    ? { top: w.top, right: offset }
    : { top: w.top, left: offset };
}

export default function FloatingWords({ animate }: { animate: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".float-word");
      gsap.from(items, {
        opacity: 0,
        scale: 0.92,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.5,
        ease: "power2.out",
      });
      items.forEach((el) => {
        gsap.to(el, {
          y: gsap.utils.random(-10, 10),
          duration: gsap.utils.random(2.6, 4.6),
          delay: gsap.utils.random(0, 1.5),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [animate]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {WORDS.map((w) => (
        <div
          key={w.text}
          className="absolute"
          style={{ ...position(w), transform: `rotate(${w.rotate}deg)` }}
        >
          <span
            className="float-word relative inline-block font-display font-extrabold uppercase leading-none tracking-tight"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 4rem)",
              color: w.soft ? "var(--color-sand)" : "var(--color-paper)",
            }}
          >
            {w.text}
            {w.underline && (
              <svg
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-3 left-0 h-3 w-full text-vermilion"
              >
                <path
                  d="M2 8 C 40 2, 80 12, 120 6 S 180 4, 198 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
