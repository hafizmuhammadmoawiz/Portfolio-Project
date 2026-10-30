import {
  ScanSearch,
  FolderLock,
  ShieldCheck,
  Globe,
  type LucideIcon,
} from "lucide-react";

export interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  details: string;
  highlights: string[];
  tech: string[];
  icon: LucideIcon;
  image?: string;
  github?: string;
  demo?: string;
  techEditable?: boolean;
}

export const projects: Project[] = [
  {
    id: "portfolio",
    number: "01",
    title: "Personal Portfolio Website",
    icon: Globe,
    image: "/images/web_proj.png",
    demo: "/Video/web_demo.mp4",
    github: "https://github.com/hafizmuhammadmoawiz/Portfolio-Project",
    description:
      "A personal portfolio showcasing my cybersecurity journey, technical skills, education, experience, and projects.",
    details:
      "This responsive portfolio website presents my background as a cybersecurity student and aspiring penetration tester. It brings together my skills, education, experience, certifications, and practical work in one place.",
    highlights: [
      "Responsive personal portfolio",
      "Cybersecurity-focused visual design",
      "Dedicated sections for projects and experience",
    ],
    tech: ["React", "Vite", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "cryptvault",
    number: "02",
    title: "CryptVault",
    icon: FolderLock,
    image: "/images/CryptVault_proj.png",
    demo: "/Video/CryptVault_demo.mp4",
    github: "https://github.com/hafizmuhammadmoawiz/CryptVault",
    description:
      "A desktop file vault that encrypts private files and gives the encryption key only to the user.",
    details:
      "CryptVault is a Python desktop application focused on file encryption and secure authentication. Its core features include registration and login, email OTP verification, password recovery, per-file Fernet encryption, and built-in security utilities. Encryption keys are provided to the user rather than retained by the application.",
    highlights: [
      "Fernet encryption with AES-128-CBC and HMAC-SHA256",
      "bcrypt password hashing and email OTP verification",
      "File integrity verification using SHA-256",
      "Password generator, hash identifier, and password attack simulator",
    ],
    tech: ["Python", "CustomTkinter", "SQLite", "Fernet", "bcrypt"],
  },
  {
    id: "security-assessments",
    number: "03",
    title: "Security Assessment Portfolio",
    icon: ShieldCheck,
    image: "/images/internship_proj.png",
    github:
      "https://github.com/hafizmuhammadmoawiz/Security-Assessments-Portfolio",
    description:
      "Documented hands-on security testing completed during an eight-week Software Security Testing internship at Pakistan's National CERT.",
    details:
      "This portfolio documents security assessments across web applications, network infrastructure, mobile applications, and APIs. Work was performed in intentionally vulnerable training applications and isolated lab environments, with findings, proof-of-concept evidence, and remediation guidance.",
    highlights: [
      "Web security testing with DVWA and OWASP Juice Shop",
      "Network and infrastructure assessment using Metasploitable2",
      "Mobile application analysis using DIVA and mobile security tools",
      "API security testing using VAmPI",
      "Security findings, evidence, and remediation reporting",
    ],
    tech: [
      "Nmap",
      "OpenVAS",
      "Burp Suite",
      "OWASP ZAP",
      "MobSF",
      "JADX",
      "Postman",
      "Kali Linux",
    ],
  },
  {
    id: "vulnerability-scanner",
    number: "04 (Upcoming)",
    title: "Web Vulnerability Scanner",
    icon: ScanSearch,
    image: "/images/vulnScan_proj.png",
    description:
      "An upcoming project to explore automated web security checks and vulnerability reporting.",
    details:
      "This planned project will focus on building an educational web vulnerability scanner. The implementation, supported checks, and reporting features will be defined during development. Testing will be limited to systems owned by the developer or explicitly authorized for assessment.",
    highlights: [
      "Planned web security scanning capabilities",
      "Common vulnerability detection research",
      "Future findings and report generation",
    ],
    tech: ["Python", "Flask", "Web Security"],
  },
];
