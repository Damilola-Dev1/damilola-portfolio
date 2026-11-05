// The strap and metal clip the card hangs from. The strap runs off the top of
// the screen so it always looks fixed to the page.
// Its height comes from --strap-h in src/index.css.
// On phones the strap is thin (14px), the clip is smaller, and a little
// slider sits on the strap between the two words beside it.
export default function Lanyard() {
  return (
    <div className="relative z-10 flex flex-col items-center">
      <div
        aria-hidden="true"
        className="relative w-[14px] bg-forest md:w-9"
        style={{
          height: "calc(var(--strap-h) + 32px)",
          marginTop: "-32px",
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 9px, rgba(242,235,221,0.09) 9px 11px)",
        }}
      >
        {/* stitched edges */}
        <span className="absolute inset-y-0 left-[2px] border-l border-dashed border-sand/50 md:left-[3px]" />
        <span className="absolute inset-y-0 right-[2px] border-r border-dashed border-sand/50 md:right-[3px]" />
        {/* a single vermilion thread down the middle */}
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-vermilion md:w-[2px]" />

        {/* PHONES ONLY: slider on the strap.
            The strap starts 32px above the screen, so top-[94px] is about
            62px down the screen. Change it to move the slider. */}
        <span className="absolute left-1/2 top-[94px] h-[15px] w-[30px] -translate-x-1/2 rounded-[4px] border border-ink/60 bg-sand md:hidden">
          <span className="absolute inset-x-[6px] top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-ink/70" />
        </span>
      </div>

      {/* metal clip */}
      <svg
        aria-hidden="true"
        width="36"
        height="64"
        viewBox="0 0 36 64"
        className="-mt-px h-[46px] w-[26px] text-sand md:h-16 md:w-9"
      >
        <rect
          x="6"
          y="0"
          width="24"
          height="20"
          rx="4"
          fill="currentColor"
          stroke="#15130f"
          strokeWidth="1.5"
        />
        <rect
          x="12"
          y="16"
          width="12"
          height="44"
          rx="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <rect
          x="10"
          y="14"
          width="16"
          height="48"
          rx="8"
          fill="none"
          stroke="#15130f"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
