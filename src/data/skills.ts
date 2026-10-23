import { Radar, Bug, ScanSearch, Crosshair, Swords, Terminal, Server, Network, Globe, Flame, Activity, Code2, FileCode, Braces, Fish, Search, FileText, Cable, ShieldCheck, Shield, Cpu, Waypoints, type LucideIcon } from "lucide-react";

export interface Skill { name: string; desc: string; icon: LucideIcon }
export interface SkillCategory { title: string; blurb: string; icon: LucideIcon; skills: Skill[] }

export const skillCategories: SkillCategory[] = [
  { title: "Security Testing", blurb: "Tools for scanning, probing and authorized testing.", icon: Crosshair, skills: [
    { name: "Nmap", desc: "Host and service discovery", icon: Radar },
    { name: "Burp Suite", desc: "Web traffic interception", icon: Bug },
    { name: "OWASP ZAP", desc: "Web vulnerability scanning", icon: ScanSearch },
    { name: "Nuclei", desc: "Template-based scanning", icon: Crosshair },
    { name: "Metasploit Framework", desc: "Exploitation framework in labs", icon: Swords },
  ]},
  { title: "Operating Systems", blurb: "Comfortable working from the command line.", icon: Terminal, skills: [
    { name: "Kali Linux", desc: "Security-focused distribution", icon: Shield },
    { name: "Ubuntu", desc: "General-purpose Linux", icon: Server },
    { name: "Linux command line", desc: "Shell, files and permissions", icon: Terminal },
  ]},
  { title: "Networking", blurb: "Understanding how systems talk to each other.", icon: Network, skills: [
    { name: "TCP/IP", desc: "Core protocol suite", icon: Waypoints },
    { name: "DNS", desc: "Name resolution", icon: Globe },
    { name: "Ports and services", desc: "Exposed network surface", icon: Cable },
    { name: "Firewalls", desc: "Traffic filtering concepts", icon: Flame },
    { name: "Network traffic analysis", desc: "Reading packets and flows", icon: Activity },
  ]},
  { title: "Programming & Development", blurb: "Building small tools and secure applications.", icon: Code2, skills: [
    { name: "Python", desc: "Scripting and tooling", icon: FileCode },
    { name: "Flask", desc: "Lightweight web apps", icon: Cpu },
    { name: "HTML and CSS", desc: "Structure and styling", icon: Code2 },
    { name: "JavaScript fundamentals", desc: "Core language concepts", icon: Braces },
  ]},
  { title: "Security Analysis", blurb: "Finding, understanding and documenting weaknesses.", icon: ShieldCheck, skills: [
    { name: "Wireshark", desc: "Packet capture and inspection", icon: Fish },
    { name: "Bandit", desc: "Static analysis for Python", icon: Search },
    { name: "Vulnerability assessment", desc: "Identify and prioritise risk", icon: ShieldCheck },
    { name: "Web application security testing", desc: "OWASP-style checks", icon: Bug },
    { name: "Security documentation", desc: "Clear, structured findings", icon: FileText },
  ]},
];
