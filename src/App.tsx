import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTheme } from "./hooks/useTheme";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function ScrollUI() {
  const [p, setP] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;

    const on = () => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;

        setP(max > 0 ? window.scrollY / max : 0);
        setShow(window.scrollY > 700);
      });
    };

    on();
    window.addEventListener("scroll", on, { passive: true });

    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
        style={{
          transform: `scaleX(${p})`,
          boxShadow: "0 0 10px var(--accent)",
        }}
        aria-hidden="true"
      />

      <a
        href="#home"
        aria-label="Back to top"
        tabIndex={show ? 0 : -1}
        className={`fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[var(--btn-bg)] text-[var(--btn-fg)] shadow-[var(--btn-glow)] transition-all duration-300 hover:-translate-y-1 ${
          show
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp size={20} aria-hidden="true" />
      </a>
    </>
  );
}

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <ScrollUI />

      <Navbar theme={theme} onToggle={toggle} />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Experience />
        <Certifications />
        <Contact />
      </main>

      <Footer />
    </>
  );
}