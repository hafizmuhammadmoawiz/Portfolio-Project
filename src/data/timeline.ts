import { GraduationCap, School, BookOpen, Award, FlaskConical, Bug, Network, FileText, type LucideIcon } from "lucide-react";

export interface EducationEntry { institution: string; qualification: string; start: string; end: string; status: "Current" | "Completed"; description: string; icon: LucideIcon; placeholder?: boolean }
export const education: EducationEntry[] = [
  { institution: "NUTECH University, Islamabad", qualification: "BS Cybersecurity", start: "2024", end: "Present", status: "Current", icon: GraduationCap,
    description: "Fourth semester. Studying cybersecurity fundamentals, networking, programming and practical security testing." },
  { institution: "College name", qualification: "Intermediate / A-Levels", start: "Start", end: "End", status: "Completed", icon: School, placeholder: true,
    description: "Editable placeholder. Replace with verified college details." },
  { institution: "School name", qualification: "Matriculation / O-Levels", start: "Start", end: "End", status: "Completed", icon: BookOpen, placeholder: true,
    description: "Editable placeholder. Replace with verified secondary school details." },
  { institution: "Additional programme (optional)", qualification: "Course or training", start: "Start", end: "End", status: "Completed", icon: Award, placeholder: true,
    description: "Optional entry. Add a verified academic or training record, or remove this card." },
];

export interface ExperienceEntry { title: string; organization: string; dates: string; description: string; tools: string[]; status: string; icon: LucideIcon }
export const experience: ExperienceEntry[] = [
  { title: "Software Testing and Vulnerability Assessment Training", organization: "Practical learning · sample entry", dates: "Add dates", icon: FlaskConical,
    description: "Hands-on practice identifying and assessing weaknesses in authorized, intentionally vulnerable lab targets.", tools: ["Nmap", "Nuclei", "OWASP ZAP"], status: "Sample content · edit" },
  { title: "Web Application Security Practice", organization: "Self-directed lab work · sample entry", dates: "Add dates", icon: Bug,
    description: "Exploring common web vulnerabilities and testing workflows with proxy and scanning tools.", tools: ["Burp Suite", "OWASP ZAP", "Flask"], status: "Sample content · edit" },
  { title: "Network Security and Infrastructure Labs", organization: "Lab environment · sample entry", dates: "Add dates", icon: Network,
    description: "Studying protocols, services and traffic in controlled network labs.", tools: ["Wireshark", "Nmap", "Kali Linux"], status: "Sample content · edit" },
  { title: "Security Research and Technical Documentation", organization: "Personal learning · sample entry", dates: "Add dates", icon: FileText,
    description: "Writing structured notes and findings from lab exercises so work is clear and reproducible.", tools: ["Markdown", "Bandit", "Linux CLI"], status: "Sample content · edit" },
];
