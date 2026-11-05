import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";

type SectionProps = {
  id: string;
  title: string;
  children?: React.ReactNode;
};

function Section({ id, title, children }: SectionProps) {
  return (
    <section
      id={id}
      className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-center px-6 py-24 md:px-10"
    >
      <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
        {title}
      </h2>
      <div className="mt-6 text-sand">
        {children ?? <p>Content coming soon.</p>}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Section id="work" title="Work" />
        <Section id="skills" title="Skills" />
        <Section id="contact" title="Contact" />
      </main>
    </>
  );
}
