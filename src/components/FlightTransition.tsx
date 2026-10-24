import { useEffect } from "react";
import { Plane } from "lucide-react";

// Props received from App.tsx
type FlightTransitionProps = {
  active: boolean;
  onComplete: () => void;
};

export default function FlightTransition({
  active,
  onComplete,
}: FlightTransitionProps) {
  useEffect(() => {
    // Do not run the animation when inactive.
    if (!active) return;

    // Respect the user's reduced-motion preference.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Keep this duration synchronized with the CSS plane animation.
    const duration = reduceMotion ? 1 : 1800;
    const startTime = performance.now();
    const startScroll = window.scrollY;

    // Disable CSS smooth scrolling during frame-by-frame animation.
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let frame = 0;
    let completed = false;

    // Locate the Contact hero card.
    const card = document.querySelector<HTMLElement>(
      "#contact .contact-hero"
    );

    // Capture the destination once to prevent the target from shifting.
    const cardTop = card
      ? card.getBoundingClientRect().top + window.scrollY
      : startScroll;

    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );

    // Place the Contact card near the top of the viewport.
    const targetScroll = Math.min(
      maxScroll,
      Math.max(0, cardTop - window.innerHeight * 0.18)
    );

    // Cinematic acceleration and deceleration.
    const easeInOut = (t: number) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Animate the page scroll while the plane crosses the screen.
    const animateScroll = (now: number) => {
      const progress = Math.min(
        (now - startTime) / duration,
        1
      );

      const eased = easeInOut(progress);

      // Move the background continuously on every animation frame.
      const currentScroll =
        startScroll + (targetScroll - startScroll) * eased;

      window.scrollTo({
        top: currentScroll,
        behavior: "auto",
      });

      if (progress < 1) {
        frame = requestAnimationFrame(animateScroll);
        return;
      }

      // Set the final position accurately.
      window.scrollTo({
        top: targetScroll,
        behavior: "auto",
      });

      // Notify App.tsx once the flight has completed.
      if (!completed) {
        completed = true;
        onComplete();
      }
    };

    // Start scrolling immediately with the plane animation.
    frame = requestAnimationFrame(animateScroll);

    // Restore the original scroll behaviour when the effect ends.
    return () => {
      cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [active, onComplete]);

  // Render nothing when the flight is inactive.
  if (!active) return null;

  return (
    // Full-screen flight overlay; it does not block user interaction.
    <div className="flight-overlay" aria-hidden="true">
      {/* Plane enters from the left and exits on the right via CSS. */}
      <div className="flight-plane">
        <Plane size={42} strokeWidth={1.7} />
      </div>

      {/* Glowing trail follows the plane's flight animation. */}
      <div className="flight-trail" />
    </div>
  );
}
