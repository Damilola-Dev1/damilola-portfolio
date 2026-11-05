export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-10 text-sand md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
