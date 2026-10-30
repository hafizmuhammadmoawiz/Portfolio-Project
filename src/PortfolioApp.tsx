/**
 * Main page composition.
 * Connects the navigation, portfolio sections, theme state, and flight transition.
 * The "Let's Connect" actions in Navbar/Hero start FlightTransition; completion is
 * handled here so the Contact section can receive its landing highlight.
 */
import { useCallback, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTheme } from "./hooks/useTheme";

// Page sections
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

// Flight animation overlay
import FlightTransition from "./components/FlightTransition";

/**
 * ScrollUI
 * Displays the top scroll-progress bar and back-to-top button.
 */
function ScrollUI() {
  const [p, setP] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;

    const on = () => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;

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
      {/* Top scroll-progress indicator */}
      <div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
        style={{
          transform: `scaleX(${p})`,
          boxShadow: "0 0 10px var(--accent)",
        }}
        aria-hidden="true"
      />

      {/* Back-to-top button */}
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

/**
 * App
 * Connects the website sections, theme controls, and flight transition.
 */
export default function App() {
  const { theme, toggle } = useTheme();

  // Controls whether the flight animation is running
  const [flightActive, setFlightActive] = useState(false);

  // Start the flight animation from the Navbar or Hero CTA
  const startFlight = useCallback(() => {
    if (flightActive) return;

    setFlightActive(true);
  }, [flightActive]);

  // Called by FlightTransition after its animation finishes
  const finishFlight = useCallback(() => {
    setFlightActive(false);

    // Briefly highlight the Contact card after the flight
    const card = document.querySelector<HTMLElement>("#contact .contact-hero");

    if (!card) return;

    card.classList.add("flight-landed");

    window.setTimeout(() => {
      card.classList.remove("flight-landed");
    }, 1800);
  }, []);

  return (
    <>
      {/* Blur the website content while the plane is flying */}
      <div className={flightActive ? "flight-blur" : ""}>
        {/* Keyboard accessibility: skip directly to main content */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2"
        >
          Skip to content
        </a>

        {/* Scroll progress and back-to-top controls */}
        <ScrollUI />

        {/* Navbar with theme toggle and flight CTA */}
        <Navbar theme={theme} onToggle={toggle} onStartFlight={startFlight} />

        {/* Main website sections in the requested order */}
        <main id="main">
          <Hero onStartFlight={startFlight} />
          <About />
          <Education />
          <Skills />
          <Experience />
          <Projects />
          <Certifications />
          <Contact />
        </main>

        {/* Website footer */}
        <Footer />
      </div>

      {/* Keep the flight overlay outside the blurred website wrapper */}
      <FlightTransition active={flightActive} onComplete={finishFlight} />
    </>
  );
}
