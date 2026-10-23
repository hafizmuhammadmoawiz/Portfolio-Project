export interface Certification { title: string; issuer: string; date: string; credentialId: string; verifyUrl?: string; image?: string; category: string; placeholder: boolean }
/** Replace `image` with e.g. "/certificates/ethical-hacking.png" and set placeholder:false once real. */
export const certifications: Certification[] = [
  { title: "Ethical Hacking", issuer: "Issuing organization", date: "Issue date", credentialId: "Not yet assigned", category: "Ethical Hacking", placeholder: true },
  { title: "Web Application Security", issuer: "Issuing organization", date: "Issue date", credentialId: "Not yet assigned", category: "Web Security", placeholder: true },
  { title: "Network Security", issuer: "Issuing organization", date: "Issue date", credentialId: "Not yet assigned", category: "Networking", placeholder: true },
  { title: "Linux and Security Fundamentals", issuer: "Issuing organization", date: "Issue date", credentialId: "Not yet assigned", category: "Linux", placeholder: true },
];
