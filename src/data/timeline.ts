import {
  GraduationCap,
  School,
  BookOpen,
  Award,
  ShieldCheck,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export interface EducationEntry {
  institution: string;
  qualification: string;
  start: string;
  end: string;
  status: "Current" | "Completed";
  description: string;
  icon: LucideIcon;
  placeholder?: boolean;
}

export const education: EducationEntry[] = [
  {
    institution: "NUTECH University, Islamabad",
    qualification: "BS Cybersecurity",
    start: "2024",
    end: "2028",
    status: "Current",
    icon: GraduationCap,
    description:
      "Currently pursuing a bachelor's degree in Cybersecurity, building foundations in networking, programming, information security, and practical security testing.",
  },
  {
    institution: "Pakistan Sweet Home Cadet College, Sohawa",
    qualification: "FSc Pre-Engineering",
    start: "2022",
    end: "2024",
    status: "Completed",
    icon: School,
    description:
      "Completed Intermediate education in Pre-Engineering with 78% marks.",
  },
  {
    institution: "Iqra Girls and Boys High School",
    qualification: "Matriculation · Science",
    start: "2020",
    end: "2022",
    status: "Completed",
    icon: BookOpen,
    description:
      "Completed Matriculation with Science and Computer Science, achieving 86% marks.",
  },
];

export interface ExperienceEntry {
  title: string;
  organization: string;
  dates: string;
  description: string;
  tools: string[];
  status: string;
  icon: LucideIcon;
}

export const experience: ExperienceEntry[] = [

  {
    title: "FBISE Administrator",
    organization: "Pakistan Sweet Home AFP · Islamabad",
    dates: "Feb 2025 – Present",
    status: "Current Role",
    icon: ClipboardList,
    description:
      "Handle student-related data entry, maintain records, and coordinate with the Federal Board of Intermediate and Secondary Education (FBISE).",
    tools: [
      "Data Entry",
      "Record Keeping",
      "FBISE Coordination",
    ],
  },
  {
    title: "Software Screening Intern",
    organization: "National CERT Pakistan · Islamabad",
    dates: "Jul 2026 – Aug 2026",
    status: "Completed",
    icon: ShieldCheck,
    description:
      "Performed end-to-end vulnerability assessments using Nmap, Burp Suite, OWASP ZAP, MobSF, and OpenVAS. Prepared severity-rated technical reports with proof-of-concept evidence and remediation guidance.",
    tools: [
      "Nmap",
      "Burp Suite",
      "OWASP ZAP",
      "MobSF",
      "OpenVAS",
    ],
  },
  
];