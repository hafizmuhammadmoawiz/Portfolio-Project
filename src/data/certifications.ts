export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verifyUrl?: string;
  image?: string;
  category: string;
  placeholder: boolean;
}

export const certifications: Certification[] = [
  {
    title: "Networking Basics",
    issuer: "Cisco",
    date: "05 Sept 2026",
    credentialId: "628f5448-480f-967c-7873be34e942",
    verifyUrl:
      "https://www.netacad.com/recognitions/verify/628f5448-6682-480f-967c-7873be34e942",
    image: "/images/networking_cert.png",
    category: "Networking",
    placeholder: false,
  },
  {
    title: "Intro to Cybersecurity",
    issuer: "Cisco",
    date: "29 Aug 2026",
    credentialId: "5160e380-47d3-44ea-ade0-8a36182f38ae",
    verifyUrl:
      "https://www.netacad.com/recognitions/verify/5160e380-47d3-44ea-ade0-8a36182f38ae",
    image: "/images/intro_to_cyber.png",
    category: "Cybersecurity",
    placeholder: false,
  },
  {
    title: "Internship Certificate",
    issuer: "NCERT / PKCERT",
    date: "28 Aug 2026",
    credentialId: "PKC-26-001022",
    verifyUrl: "https://pkcert.gov.pk/certificate-issuance/cv.aspx",
    image: "/images/internship_cert.png",
    category: "Cybersecurity Internship",
    placeholder: false,
  },
  {
    title: "Pre-Security",
    issuer: "TryHackMe",
    date: "11 Feb 2026",
    credentialId: "THM-YU84Y8RZGK",
    verifyUrl:
      "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-YU84Y8RZGK.pdf",
    image: "/images/pre_security_cert.png",
    category: "Pre-Security",
    placeholder: false,
  },
];
