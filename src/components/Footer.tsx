import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-10 text-sand md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <p className="text-sm">© {new Date().getFullYear()} Damilola Samuel.</p>
        <Link
          to="/#top"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-paper"
        >
          <span className="underline decoration-vermilion decoration-2 underline-offset-4">
            Back to home
          </span>
          {/* the arrow floats up a little on hover or tap */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-vermilion transition-transform duration-300 group-hover:-translate-y-1 group-active:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-active:translate-y-0"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </Link>
      </div>
    </footer>
  );
}
