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
      className="relative flex min-h-screen flex-col items-center overflow-hidden pb-10"
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

      <a
        href="#contact"
        className="relative z-10 mt-[4vh] rounded-full bg-vermilion px-8 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
      >
        Work with me
      </a>

      {/* small screens: the floating words are hidden, so show them here */}
      <p className="relative z-10 mt-5 px-6 text-center font-display text-sm font-semibold uppercase tracking-wide text-paper md:hidden">
        Frontend Developer · Web Builder · Tech Creator
      </p>
    </section>
  );
}
