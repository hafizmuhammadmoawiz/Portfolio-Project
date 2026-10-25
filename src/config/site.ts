
/**
 * Single place for personal details, contact info and external links.
 * Leave a link as "" if it is not available.
 */
export const site: Record<string, string> = {
  name: "Hafiz Muhammad Moawiz",
  brand: "MOAWIZ.DEV",
  role: "Cybersecurity Student | Aspiring Penetration Tester",
  location: "Islamabad, Pakistan",
  university: "NUTECH University, Islamabad",

  // Contact information
  email:
    (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ??
    "hafizmuhammadmoawizz@gmail.com",

  github: "https://github.com/hafizmuhammadmoawiz",
  linkedin: "https://linkedin.com/in/muhammad-moawiz-khan",

  // Add your CV to public/cv/ before setting this path.
  cv: "",

  // Profile image
  profileImage: "/images/profile2.jpeg",
  profileAlt: "Portrait of Hafiz Muhammad Moawiz",

  learningStatus: "Currently learning: web application security",
};

export const emailConfigured = !site.email.endsWith("@example.com");


export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certification" },
  { id: "contact", label: "Contact" },
] as const;

