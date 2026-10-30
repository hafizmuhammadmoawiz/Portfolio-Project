import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Moon,
  Search,
  Sun,
  Terminal,
  X,
} from "lucide-react";

import NetworkCanvas from "../components/NetworkCanvas";
import { useTheme } from "../hooks/useTheme";
import { supabase } from "../lib/supabase";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  category: string;
  tags: string[];
  published_at: string | null;
};

function BlogHeader({ theme, toggle }: { theme: string; toggle: () => void }) {
  const isDark = theme === "dark";

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
      <div className="container-x grid min-h-[76px] grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        {/* Left: Dev2Sec branding */}
        <Link
          to="/"
          aria-label="Dev2Sec home"
          className="flex w-fit flex-col leading-tight"
        >
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            <span className="text-ink">&lt;Dev2Sec</span>
            <span className="text-accent">/&gt;</span>
          </span>
          <span className="mt-1 text-[9px] text-muted sm:text-[10px]">
            Develop to Secure
          </span>
        </Link>

        {/* Center: Write-up centre title */}
        <div className="hidden text-center sm:block">
          <span className="font-mono text-sm tracking-[0.12em] text-muted md:text-base">
            Here is <span className="font-semibold text-accent">Moawiz's</span>{" "}
            Write-up Centre
          </span>
        </div>

        {/* Right: Home and theme buttons */}
        <div className="flex min-w-0 items-center justify-self-end gap-1.5 sm:gap-3">
          <Link
            to="/"
            className="btn btn-primary !min-h-0 !rounded-full !px-2 !py-1.5 !text-[10px] !leading-tight sm:!px-5 sm:!py-3 sm:!text-sm"
          >
            <ArrowLeft size={16} />
            <Home size={22} strokeWidth={2.8} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-transparent text-accent transition hover:border-[var(--accent-line)] hover:shadow-[0_0_18px_var(--glow)] sm:h-11 sm:w-11"
          >
            {isDark ? (
              <Sun size={19} aria-hidden="true" />
            ) : (
              <Moon size={19} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile: centre title below the main row */}
        <div className="col-span-2 pb-3 text-center sm:hidden">
          <span className="font-mono text-[10px] tracking-wider text-muted">
            Here is <span className="font-semibold text-accent">Moawiz's</span>{" "}
            Write-up Centre
          </span>
        </div>
      </div>
    </header>
  );
}

export default function Blog() {
  const { theme, toggle } = useTheme();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function loadArticles() {
      setLoading(true);
      setError("");

      try {
        const { data, error: queryError } = await supabase
          .from("articles")
          .select(
            "id,title,slug,excerpt,cover_image_url,category,tags,published_at",
          )
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (cancelled) return;

        if (queryError) {
          setError("Write-ups load nahi ho sake. Please baad mein try karein.");
        } else {
          setArticles((data ?? []) as Article[]);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Write-ups load nahi ho sake. Supabase connection check karein.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    "All",
    ...new Set(articles.map((article) => article.category).filter(Boolean)),
  ];

  const filteredArticles = articles.filter((article) => {
    const term = search.toLowerCase().trim();

    const matchesSearch =
      !term ||
      article.title.toLowerCase().includes(term) ||
      (article.excerpt ?? "").toLowerCase().includes(term) ||
      (article.category ?? "").toLowerCase().includes(term) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(term));

    const matchesCategory = category === "All" || article.category === category;

    return matchesSearch && matchesCategory;
  });

  function formatDate(date: string | null) {
    if (!date) return "Recently published";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently published";
    }

    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  }

  return (
    <>
      <BlogHeader theme={theme} toggle={toggle} />

      <main className="relative isolate min-h-screen overflow-hidden bg-canvas text-ink">
        {/* Reused portfolio hero background */}
        <div
          className="ambient pointer-events-none fixed inset-0 z-[-1]"
          aria-hidden="true"
        />

        <div
          className="grid-bg pointer-events-none fixed inset-0 z-[-1]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none fixed inset-0 z-[-1]"
          aria-hidden="true"
        >
          <NetworkCanvas className="opacity-70" />
        </div>

        {/* Heading glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[32rem] w-[52rem] max-w-full -translate-x-1/2 rounded-full opacity-40 blur-[100px]"
          style={{
            background:
              "radial-gradient(ellipse, var(--glow) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <section className="container-x relative z-10 pb-20 pt-28 sm:pt-36">
          <div className="mx-auto max-w-4xl text-center">
            <div className="eyebrow justify-center">
              <Terminal size={15} />
              Dev2Sec / Knowledge Base
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Cybersecurity <span className="grad-text">Write-ups</span>
            </h1>

            <p className="lead mx-auto">
              Practical security research, penetration testing walkthroughs, and
              lessons from the lab.
            </p>

            <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-line bg-card/90 px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.08)] backdrop-blur-md transition focus-within:border-[var(--accent-line)]">
              <Search
                size={19}
                className="shrink-0 text-muted"
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search cybersecurity write-ups..."
                aria-label="Search write-ups"
                className="w-full min-w-0 !border-0 !bg-transparent text-base text-ink !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none sm:text-lg placeholder:text-muted"
              />
            </div>

            <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-muted sm:text-xs">
              RESEARCH <span className="text-accent">/</span> TEST{" "}
              <span className="text-accent">/</span> DOCUMENT{" "}
              <span className="text-accent">/</span> SECURE
            </p>
          </div>

          {!loading && !error && categories.length > 1 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    category === item
                      ? "border-[var(--accent-line)] bg-[var(--chip-bg)] text-accent shadow-[0_0_20px_var(--glow)]"
                      : "border-line bg-card/80 text-muted backdrop-blur-sm hover:border-[var(--accent-line)] hover:text-ink"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          <div className="mb-6 mt-14 flex items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="eyebrow">Knowledge / Research</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Latest Write-ups
              </h2>
              <p className="mt-2 text-sm text-muted">
                Practical notes from the security lab.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-line bg-card/80 px-3 py-2 text-sm text-muted backdrop-blur-sm sm:flex">
              <BookOpen size={16} className="text-accent" />
              {articles.length} published
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-line bg-card/80"
                >
                  <div className="aspect-[16/9] animate-pulse bg-[var(--bg-2)]" />
                  <div className="space-y-4 p-5">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--bg-2)]" />
                    <div className="h-5 w-4/5 animate-pulse rounded bg-[var(--bg-2)]" />
                    <div className="h-3 animate-pulse rounded bg-[var(--bg-2)]" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--bg-2)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-line bg-card/90 px-6 py-12 text-center backdrop-blur-md">
              <Terminal size={32} className="mx-auto text-accent" />
              <h3 className="mt-5 text-xl font-bold">Write-ups unavailable</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                {error}
              </p>
              <p className="mt-2 text-xs text-muted">
                Supabase connection aur articles table ki public read policy
                check karein.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn btn-primary mt-6"
              >
                Try again
              </button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-line bg-card/85 px-6 py-16 text-center backdrop-blur-md">
              <BookOpen size={34} className="mx-auto text-accent" />
              <h3 className="mt-5 text-xl font-bold">
                {articles.length === 0
                  ? "Write-ups are coming soon"
                  : "No matching write-ups"}
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                {articles.length === 0
                  ? "New cybersecurity research and practical security notes will appear here once published."
                  : "Try another search term or select a different category."}
              </p>

              {(search || category !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="btn btn-ghost mt-5"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-muted">
                Showing{" "}
                <span className="font-semibold text-ink">
                  {filteredArticles.length}
                </span>{" "}
                {filteredArticles.length === 1 ? "write-up" : "write-ups"}
              </p>

              <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--accent-line)] hover:shadow-[0_16px_45px_var(--glow)]"
                  >
                    <Link
                      to={`/blog/${encodeURIComponent(article.slug)}`}
                      aria-label={`Read ${article.title}`}
                      className="relative block overflow-hidden border-b border-line bg-[var(--bg-2)]"
                    >
                      {article.cover_image_url ? (
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          loading="lazy"
                          className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-50"
                            style={{
                              background:
                                "radial-gradient(circle at center, var(--glow), transparent 70%)",
                            }}
                          />
                          <Terminal
                            size={42}
                            className="relative text-accent opacity-80 transition duration-300 group-hover:scale-110"
                          />
                          <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-muted">
                            DEV2SEC / RESEARCH
                          </span>
                        </div>
                      )}

                      <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/65 px-3 py-1 font-mono text-[10px] tracking-wider text-white backdrop-blur-sm">
                        SECURITY NOTES
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {article.category && (
                          <span className="chip">{article.category}</span>
                        )}
                        <span className="text-xs text-muted">
                          {formatDate(article.published_at)}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold leading-snug">
                        <Link
                          to={`/blog/${encodeURIComponent(article.slug)}`}
                          className="transition hover:text-accent"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-muted">
                        {article.excerpt ||
                          "Explore this cybersecurity write-up."}
                      </p>

                      {article.tags?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-muted">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        to={`/blog/${encodeURIComponent(article.slug)}`}
                        className="mt-6 inline-flex items-center gap-2 border-t border-line pt-4 text-sm font-bold text-accent"
                      >
                        Read write-up
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
