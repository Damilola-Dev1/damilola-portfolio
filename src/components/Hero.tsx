import { useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { gsap } from "gsap";
import IDCard from "./IDCard";
import Lanyard from "./Lanyard";
import FloatingWords from "./FloatingWords";

// Subtle paper grain over the dark background.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// How long the card stays on each side before turning (seconds)
const FRONT_HOLD = 4;
const BACK_HOLD = 5.5;

// Phone layout: word sizes and where the two words beside the strap sit.
// Make the numbers bigger to move a word down, smaller to move it up.
const TOP_WORD_SIZE = "clamp(1.25rem, 6vw, 2rem)";
const BOTTOM_WORD_SIZE = "clamp(1.6rem, 8vw, 2.4rem)";
const FRONTEND_TOP = "0.75rem";
const DEVELOPER_TOP = "3.25rem";
// Space between the strap and each word
const STRAP_GAP = "20px";

export default function Hero() {
  const swingRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<gsap.core.Timeline | null>(null);
  const hoverRef = useRef(false);
  const flippedRef = useRef(false);

  const [reduced] = useState(reducedMotion);
  const [flipped, setFlipped] = useState(false);

  const updateFlipped = (value: boolean) => {
    if (flippedRef.current !== value) {
      flippedRef.current = value;
      setFlipped(value);
    }
  };

  const rotation = () => Number(gsap.getProperty(flipRef.current, "rotationY"));
  const syncFlipped = () => updateFlipped(rotation() > 90);
  const pauseIfHovered = () => {
    if (hoverRef.current) autoRef.current?.pause();
  };

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Card drops in on its lanyard, then keeps swinging gently
      gsap.set(swingRef.current, { transformOrigin: "50% 0%" });
      gsap.from(swingRef.current, {
        y: -520,
        duration: 1.3,
        ease: "power3.out",
      });
      gsap.fromTo(
        swingRef.current,
        { rotation: -2.5 },
        {
          rotation: 2.5,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
      );

      // The card turns itself: front, pause, back, pause, repeat
      autoRef.current = gsap
        .timeline({ repeat: -1, onUpdate: syncFlipped })
        .to(
          flipRef.current,
          { rotationY: 180, duration: 1, ease: "power2.inOut" },
          `+=${FRONT_HOLD}`,
        )
        .call(pauseIfHovered)
        .to(
          flipRef.current,
          { rotationY: 0, duration: 1, ease: "power2.inOut" },
          `+=${BACK_HOLD}`,
        )
        .call(pauseIfHovered);
    });

    return () => {
      ctx.revert();
      autoRef.current = null;
    };
  }, [reduced]);

  // Hovering with a mouse holds the card still so the button is easy to click
  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoverRef.current = true;
    const r = rotation();
    if (r < 1 || r > 179) autoRef.current?.pause();
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoverRef.current = false;
    autoRef.current?.resume();
  };

  // Clicking the card flips it by hand and stops the automatic turning
  const onCardClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) return;
    autoRef.current?.kill();
    autoRef.current = null;
    const to = flippedRef.current ? 0 : 180;
    if (reduced) {
      gsap.set(flipRef.current, { rotationY: to });
      updateFlipped(to === 180);
      return;
    }
    gsap.to(flipRef.current, {
      rotationY: to,
      duration: 0.9,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: syncFlipped,
    });
  };

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col items-center overflow-hidden pb-14 md:pb-10"
    >
      <h1 className="sr-only">
        Damilola Samuel, frontend developer, web builder and tech creator in
        Lagos, Nigeria
      </h1>

      {/* paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: GRAIN }}
      />

      <FloatingWords animate={!reduced} />

      {/* PHONES ONLY: "Frontend" and "Developer" sit either side of the strap,
          one a little higher and one a little lower. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 md:hidden"
      >
        <span
          className="absolute font-display font-extrabold uppercase leading-none tracking-tight text-paper"
          style={{
            top: FRONTEND_TOP,
            right: `calc(50% + ${STRAP_GAP})`,
            fontSize: TOP_WORD_SIZE,
          }}
        >
          Frontend
        </span>
        <span
          className="absolute font-display font-extrabold uppercase leading-none tracking-tight text-sand"
          style={{
            top: DEVELOPER_TOP,
            left: `calc(50% + ${STRAP_GAP})`,
            fontSize: TOP_WORD_SIZE,
          }}
        >
          Developer
        </span>
      </div>

      {/* the hanging card */}
      <div ref={swingRef} className="relative z-10 flex flex-col items-center">
        <Lanyard />
        <div
          className="cursor-pointer"
          style={{ perspective: 1200 }}
          title="Click to flip the card"
          onClick={onCardClick}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
        >
          <IDCard innerRef={flipRef} flipped={flipped} />
        </div>
      </div>

      {/* PHONES ONLY: the other two identities under the card.
          (The h1 above already tells screen readers everything.) */}
      <p
        aria-hidden="true"
        className="relative z-10 mt-8 px-6 text-center font-display font-extrabold uppercase leading-[1.05] tracking-tight md:hidden"
        style={{ fontSize: BOTTOM_WORD_SIZE }}
      >
        <span className="block">
          <span className="text-paper">Web </span>
          <span className="relative inline-block text-sand">
            Builder
            <svg
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-2 w-full text-vermilion"
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
          </span>
        </span>
        <span className="mt-2 block">
          <span className="text-paper">Tech </span>
          <span className="text-sand">Creator</span>
        </span>
      </p>

      <a
        href="#contact"
        className="relative z-10 mt-8 rounded-full bg-vermilion px-8 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 md:mt-[4vh]"
      >
        Work with me
      </a>
    </section>
  );
}
