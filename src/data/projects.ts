import { ScanSearch, FolderLock, HeartPulse, FlaskConical, type LucideIcon } from "lucide-react";

export interface Project {
  id: string; number: string; title: string; description: string; details: string;
  highlights: string[]; tech: string[]; icon: LucideIcon;
  /** Optional screenshot, e.g. "/images/projects/scanner.png" */
  image?: string;
  /** Leave empty until the repository / demo is public */
  github?: string; demo?: string;
  techEditable?: boolean;
}

export const projects: Project[] = [
  { id: "scanner", number: "01", title: "Simple Web Vulnerability Scanner", icon: ScanSearch,
    description: "An educational Python and Flask application designed to explore web security checks and common application weaknesses.",
    details: "A learning project that explores how basic web security checks work and how common application weaknesses show up in HTTP behaviour. Intended for use only against systems that are owned or explicitly authorized for testing.",
    highlights: ["Explores common web application weaknesses", "Built with Python and Flask", "Educational use on authorized targets only"],
    tech: ["Python", "Flask", "HTTP", "Web Security"] },
  { id: "vault", number: "02", title: "Secure File Vault", icon: FolderLock,
    description: "A file-protection application focused on authentication, access control, secure file handling, and security-conscious design.",
    details: "A desktop application that practises security-conscious design: authenticating users, controlling access to files, and handling stored files carefully.",
    highlights: ["Password hashing with bcrypt", "Access control and secure file handling", "Desktop interface built with CustomTkinter"],
    tech: ["Python", "SQLite", "bcrypt", "CustomTkinter"] },
  { id: "hospital", number: "03", title: "Hospital Management System", icon: HeartPulse,
    description: "A software development project focused on hospital workflows, application structure, data management, and access control.",
    details: "A software development project modelling hospital workflows. It focuses on application structure, managing data and restricting access by role.",
    highlights: ["Hospital workflow modelling", "Structured data management", "Role-based access control"],
    tech: ["Editable: add actual stack"], techEditable: true },
  { id: "lab", number: "04", title: "Cybersecurity Lab Portfolio", icon: FlaskConical,
    description: "A collection of authorized practical exercises involving reconnaissance, static code analysis, web application testing, Linux security, and network analysis.",
    details: "A collection of practical exercises carried out in authorized lab environments, covering reconnaissance, static code analysis, web application testing, Linux security and network analysis.",
    highlights: ["Reconnaissance with Nmap", "Static analysis with Bandit", "Packet analysis with Wireshark"],
    tech: ["Kali Linux", "Nmap", "OWASP ZAP", "Bandit", "Wireshark"] },
];
