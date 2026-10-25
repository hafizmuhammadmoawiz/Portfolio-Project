import { BookOpen, FileEdit, Globe, LayoutDashboard, TrendingUp } from "lucide-react";

// Shared dashboard types, defaults and pure helper functions.
export type Section = "Overview" | "All articles" | "Published" | "Drafts" | "Analytics" | "Settings";
export type ArticleStatus = "draft" | "published";
export type Article = {
  id: string; title: string; slug: string; excerpt: string; content: string;
  cover_image_url: string; category: string; tags: string[]; status: ArticleStatus;
  published_at: string | null; created_at: string; updated_at: string;
};
export type ArticleForm = {
  title: string; slug: string; excerpt: string; content: string; cover_image_url: string;
  category: string; tags: string; status: ArticleStatus;
};
export const emptyForm: ArticleForm = {
  title: "", slug: "", excerpt: "", content: "", cover_image_url: "",
  category: "Cybersecurity", tags: "", status: "draft",
};
export const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "All articles", icon: BookOpen },
  { label: "Published", icon: Globe },
  { label: "Drafts", icon: FileEdit },
  { label: "Analytics", icon: TrendingUp },
] as const;

export function slugify(value: string) {
  return value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}
export function readableDate(value: string | null) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}
export function htmlToText(html: string) {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, " ").trim();
  const node = document.createElement("div"); node.innerHTML = html; return node.textContent?.trim() ?? "";
}
