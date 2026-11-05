import type { CSSProperties, Ref } from "react";

// 1. Put your photo in the `public` folder (for example public/portrait.jpg)
// 2. Set this to "/portrait.png"
const PORTRAIT_SRC = "/portrait.png";

const faceStyle: CSSProperties = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

// Widths of the bars. Odd entries are gaps.
const BARS = [
  3, 1, 2, 1, 1, 1, 3, 2, 1, 1, 1, 2, 3, 1, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 1, 3,
  1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 3,
];

function Barcode() {
  const total = BARS.reduce((sum, w) => sum + w, 0);
  let x = 0;
  const rects = BARS.map((w, i) => {
    const rect =
      i % 2 === 0 ? (
        <rect key={i} x={x} y={0} width={w} height={30} fill="currentColor" />
      ) : null;
    x += w;
    return rect;
  });
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${total} 30`}
      preserveAspectRatio="none"
      className="h-[1.8em] w-full text-ink"
    >
      {rects}
    </svg>
  );
}

function Slot() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-[0.8em] h-[0.9em] w-[3.4em] -translate-x-1/2 rounded-full bg-ink"
    />
  );
}

type Props = {
  innerRef: Ref<HTMLDivElement>;
  flipped: boolean;
};

export default function IDCard({ innerRef, flipped }: Props) {
  return (
    // Everything inside is sized in `em`, so the whole card scales with its
    // width. The width comes from --card-w in src/index.css.
    <div
      className="relative -mt-7"
      style={{
        width: "var(--card-w)",
        aspectRatio: "2 / 3",
        fontSize: "calc(var(--card-w) / 17.5)",
      }}
    >
      <div
        ref={innerRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          aria-hidden={flipped}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.1em] border border-sand/30 bg-paper text-ink"
          style={faceStyle}
        >
          <div className="relative bg-forest px-[1.3em] pb-[0.9em] pt-[2.2em] text-paper">
            <Slot />
            <div className="flex justify-between font-mono text-[0.68em] uppercase tracking-[0.18em]">
              <span>Developer pass</span>
              <span>Lagos, NG</span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-[1.3em] pb-[1.2em] pt-[1.1em]">
            {/* portrait */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[0.5em] bg-sand">
              {PORTRAIT_SRC ? (
                <img
                  src={PORTRAIT_SRC}
                  alt="Portrait of Damilola Samuel"
                  className="absolute inset-0 h-full w-full object-cover object-[50%_0%]"
                />
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full text-forest/35"
                >
                  <circle cx="50" cy="38" r="17" fill="currentColor" />
                  <path
                    d="M14 100c2-26 17-40 36-40s34 14 36 40z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {/* print-style corner marks */}
              <span className="absolute left-[0.5em] top-[0.5em] h-[0.8em] w-[0.8em] border-l-2 border-t-2 border-ink/50" />
              <span className="absolute bottom-[0.5em] right-[0.5em] h-[0.8em] w-[0.8em] border-b-2 border-r-2 border-ink/50" />
            </div>

            <div className="mt-[1em]">
              <p className="font-display text-[1.9em] font-extrabold uppercase leading-[0.88] tracking-tight">
                Damilola
                <br />
                Samuel
              </p>
              <p className="mt-[0.7em] flex items-center gap-[0.6em] font-mono text-[0.74em] font-medium uppercase tracking-[0.14em] text-forest">
                <span className="inline-block h-[0.55em] w-[0.55em] rounded-full bg-vermilion" />
                Frontend Developer
              </p>
            </div>

            <div className="mt-[0.9em]">
              <Barcode />
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          aria-hidden={!flipped}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.1em] border border-sand/30 bg-forest px-[1.4em] pb-[1.4em] pt-[2.8em] text-paper"
          style={{ ...faceStyle, transform: "rotateY(180deg)" }}
        >
          <Slot />
          <p className="font-mono text-[0.68em] uppercase tracking-[0.18em] text-sand">
            About me
          </p>
          <p className="mt-[1em] font-display text-[1.75em] font-semibold leading-[1.15] tracking-tight">
            I build digital experiences that solve real business problems.
          </p>
          <svg
            aria-hidden="true"
            viewBox="0 0 120 10"
            className="mt-[0.5em] h-[0.7em] w-[7em] text-vermilion"
          >
            <path
              d="M2 6 C 25 1, 45 9, 70 4 S 105 3, 118 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="mt-auto">
            <a
              href="#work"
              tabIndex={flipped ? 0 : -1}
              className="inline-flex items-center gap-[0.6em] rounded-full bg-paper px-[1.3em] py-[0.75em] text-[0.95em] font-semibold text-forest transition-transform hover:-translate-y-0.5"
            >
              View my works
              <span aria-hidden="true" className="text-vermilion">
                →
              </span>
            </a>
            <p className="mt-[1.2em] font-mono text-[0.64em] uppercase leading-relaxed tracking-[0.14em] text-sand">
              Frontend Developer · Web Builder · Tech Creator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
