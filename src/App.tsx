import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Work from "./components/Work";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import MoreAbout from "./components/MoreAbout";

// Scrolls to the top when the page changes, and to the section when the link
// has a #name (for example /#contact from the More about me page).
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      previous.current = pathname;
    }
    if (hash) {
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView();
    }
  }, [pathname, hash, key]);

  return null;
}

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Work />
      <Reviews />
      <Contact />
    </main>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/more-about" element={<MoreAbout />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
