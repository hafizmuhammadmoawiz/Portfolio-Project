/**
 * Single place for personal details, contact info and external links.
 * Leave a link as "" to show it as "not linked yet" (no fake URLs).
 */
export const site: Record<string, string> = {
  name: "Hafiz Muhammad Moawiz",
  brand: "MOAWIZ.DEV",
  role: "Cybersecurity Student | Aspiring Penetration Tester",
  location: "Islamabad, Pakistan",
  university: "NUTECH University, Islamabad",

  // Recipient for the contact form (mailto fallback). REPLACE BEFORE PUBLISHING.
  email: (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? "your.email@example.com",
  github: "",
  linkedin: "",
  cv: "", // e.g. "/cv/Moawiz-CV.pdf" (place the file in public/cv/)

  // Replace the file at public/images/profile.svg, or point to e.g. "/images/profile.jpg".
  profileImage: "/images/profile2.jpeg",
  profileAlt: "Portrait of Hafiz Muhammad Moawiz (placeholder image)",

  learningStatus: "Currently learning: web application security",
};

export const emailConfigured = !site.email.endsWith("@example.com");

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;
