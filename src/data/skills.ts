import {
  Radar,
  Bug,
  ScanSearch,
  Crosshair,
  Swords,
  Terminal,
  Server,
  Network,
  Globe,
  Flame,
  Activity,
  Code2,
  FileCode,
  Cable,
  ShieldCheck,
  Shield,
  Cpu,
  Waypoints,
  Fish,
  Search,
  type LucideIcon,
} from "lucide-react";

export interface Skill {
  name: string;
  desc: string;
  icon: LucideIcon;
}

export interface SkillCategory {
  title: string;
  blurb: string;
  icon: LucideIcon;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Security Tools",
    blurb: "Tools used for network discovery and authorized security testing.",
    icon: Crosshair,
    skills: [
      { name: "Nmap", desc: "Host and service discovery", icon: Radar },
      {
        name: "Burp Suite",
        desc: "Web traffic interception and testing",
        icon: Bug,
      },
      {
        name: "OWASP ZAP",
        desc: "Web application security scanning",
        icon: ScanSearch,
      },
      {
        name: "Metasploit Framework",
        desc: "Security testing in lab environments",
        icon: Swords,
      },
      { name: "OpenVAS", desc: "Vulnerability scanning", icon: ShieldCheck },
    ],
  },
  {
    title: "Operating Systems",
    blurb: "Operating systems and command-line environments.",
    icon: Terminal,
    skills: [
      {
        name: "Kali Linux",
        desc: "Security testing environment",
        icon: Shield,
      },
      {
        name: "Ubuntu",
        desc: "Linux desktop and system administration",
        icon: Server,
      },
      {
        name: "Windows",
        desc: "Windows operating system fundamentals",
        icon: Cpu,
      },
      {
        name: "Linux command line",
        desc: "Shell commands, files and permissions",
        icon: Terminal,
      },
      {
        name: "Kali VM / VMware",
        desc: "Virtualized security lab environments",
        icon: Server,
      },
    ],
  },
  {
    title: "Web Fundamentals",
    blurb: "Core technologies behind web pages and applications.",
    icon: Globe,
    skills: [
      { name: "HTML", desc: "Web page structure", icon: Code2 },
      { name: "CSS", desc: "Web page styling and layouts", icon: FileCode },
    ],
  },
  {
    title: "Security Assessments",
    blurb: "Identifying weaknesses and evaluating application security.",
    icon: ShieldCheck,
    skills: [
      {
        name: "Vulnerability Assessment",
        desc: "Identify and prioritise security risks",
        icon: Search,
      },
      {
        name: "OWASP Top 10 Testing",
        desc: "Testing for common web vulnerabilities",
        icon: Bug,
      },
      {
        name: "Threat Modeling (STRIDE)",
        desc: "Identifying threats and trust boundaries",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Networking",
    blurb: "Understanding network protocols, traffic and security controls.",
    icon: Network,
    skills: [
      {
        name: "TCP/IP",
        desc: "Core networking protocol suite",
        icon: Waypoints,
      },
      { name: "DNS", desc: "Domain name resolution", icon: Globe },
      {
        name: "Ports and Services",
        desc: "Understanding exposed network services",
        icon: Cable,
      },
      {
        name: "Wireshark",
        desc: "Packet capture and traffic inspection",
        icon: Fish,
      },
      {
        name: "Firewalls (UFW)",
        desc: "Linux firewall rules and traffic filtering",
        icon: Flame,
      },
    ],
  },
  {
    title: "Programming",
    blurb: "Programming fundamentals used in projects and scripting.",
    icon: Code2,
    skills: [
      {
        name: "Python (Basic)",
        desc: "Basic scripting and programming",
        icon: FileCode,
      },
      { name: "C++", desc: "Programming fundamentals", icon: Cpu },
    ],
  },
];
