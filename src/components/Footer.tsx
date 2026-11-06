export default function Footer() {
  return (
    <footer className="bg-forest px-6 text-sand md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 border-t border-paper/15 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Damilola Samuel. Frontend developer in
          Lagos, Nigeria.
        </p>
        <a
          href="#top"
          className="text-sm font-semibold text-paper underline decoration-vermilion decoration-2 underline-offset-4"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
