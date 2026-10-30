import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Copy,
  Home,
  Moon,
  Sun,
  Tag,
  Terminal,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import NetworkCanvas from "../components/NetworkCanvas";
import { supabase } from "../lib/supabase";

type Article = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  tags: string[];
  published_at: string | null;
};

function ArticleHeader({
  theme,
  toggle,
}: {
  theme: string;
  toggle: () => void;
}) {
  const isDark = theme === "dark";

  const iconButton =
    "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-transparent transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:shadow-[0_0_18px_var(--glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:h-11 sm:w-11";

  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-line bg-canvas/70 backdrop-blur-md">
      <div className="container-x grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 py-3 sm:min-h-[88px] sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:py-4">
        <Link
          to="/"
          aria-label="Dev2Sec home"
          className="flex w-fit flex-col leading-tight"
        >
          <span className="text-base font-bold tracking-tight sm:text-xl">
            <span className="text-ink">&lt;Dev2Sec</span>
            <span className="text-accent">/&gt;</span>
          </span>
          <span className="mt-1 text-[9px] text-muted sm:text-[10px]">
            Develop to Secure
          </span>
        </Link>

        <div className="flex items-center justify-self-end gap-2 sm:col-start-3 sm:row-start-1 sm:gap-3">
          <Link
            to="/"
            aria-label="Go to Home"
            title="Home"
            className={`${iconButton} text-accent`}
          >
            <Home size={23} strokeWidth={2.8} aria-hidden="true" />
          </Link>

          <Link
            to="/blog"
            aria-label="Back to Write-ups"
            title="Back to Write-ups"
            className={`${iconButton} text-ink`}
          >
            <ArrowLeft size={24} strokeWidth={3} aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
            className={`${iconButton} text-accent`}
          >
            {isDark ? (
              <Sun size={22} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <Moon size={22} strokeWidth={2.5} aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="col-span-2 row-start-2 pb-1 text-center sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:pb-0">
          <p className="font-mono text-[10px] tracking-wide text-muted sm:text-xs md:text-sm lg:text-base">
            Here is <span className="font-bold text-accent">Moawiz's</span>{" "}
            Write-up Centre
          </p>
        </div>
      </div>
    </header>
  );
}

function ArticleCodeTools() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll<HTMLElement>(
      ".article-content pre",
    );

    const cleanups: Array<() => void> = [];

    codeBlocks.forEach((pre) => {
      let wrapper = pre.closest<HTMLElement>(".article-code-block");

      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = "article-code-block";
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const toolbar = document.createElement("div");
        toolbar.className = "article-code-toolbar";

        const label = document.createElement("span");
        label.className = "article-code-label";
        label.textContent = "TERMINAL / CODE";

        const button = document.createElement("button");
        button.type = "button";
        button.className = "article-copy-button";
        button.textContent = "Copy";
        button.setAttribute("aria-label", "Copy code");

        toolbar.append(label, button);
        wrapper.insertBefore(toolbar, pre);
      }

      const button = wrapper.querySelector<HTMLButtonElement>(
        ".article-copy-button",
      );

      if (!button || button.dataset.copyListenerAttached === "true") return;

      button.dataset.copyListenerAttached = "true";

      let timeoutId: number | undefined;

      const resetButton = () => {
        button.textContent = "Copy";
        button.classList.remove("is-copied");
        button.disabled = false;
        button.setAttribute("aria-label", "Copy code");
      };

      const fallbackCopy = (code: string): boolean => {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        let success = false;

        try {
          success = document.execCommand("copy");
        } catch {
          success = false;
        }

        textarea.remove();
        return success;
      };

      const onClick = async () => {
        const code =
          pre.querySelector("code")?.textContent ?? pre.textContent ?? "";

        if (!code.trim()) {
          button.textContent = "No code found";
          return;
        }

        button.disabled = true;

        try {
          let success = false;

          if (navigator.clipboard?.writeText && window.isSecureContext) {
            try {
              await navigator.clipboard.writeText(code);
              success = true;
            } catch {
              success = fallbackCopy(code);
            }
          } else {
            success = fallbackCopy(code);
          }

          if (success) {
            button.textContent = "✓ Copied!";
            button.classList.add("is-copied");
            button.setAttribute("aria-label", "Code copied");
          } else {
            button.textContent = "Copy failed — select manually";
            button.disabled = false;
            return;
          }

          if (timeoutId) window.clearTimeout(timeoutId);
          timeoutId = window.setTimeout(resetButton, 1800);
        } catch (error) {
          console.error("Unable to copy code:", error);
          button.textContent = "Copy failed";
          button.disabled = false;
        }
      };

      button.addEventListener("click", onClick);

      cleanups.push(() => {
        button.removeEventListener("click", onClick);
        delete button.dataset.copyListenerAttached;
        if (timeoutId) window.clearTimeout(timeoutId);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { theme, toggle } = useTheme();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      setLoading(true);
      setError("");
      setArticle(null);

      if (!slug) {
        setError("Write-up not found.");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("articles")
        .select(
          "title,slug,excerpt,content,cover_image_url,category,tags,published_at",
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (cancelled) return;

      if (queryError) {
        setError("Write-up load nahi ho saka. Please baad mein try karein.");
      } else if (!data) {
        setError("Ye write-up nahi mila ya abhi publish nahi hua.");
      } else {
        setArticle(data as Article);
      }

      setLoading(false);
    }

    void loadArticle();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const formattedDate = useMemo(() => {
    if (!article?.published_at) return null;

    const date = new Date(article.published_at);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }, [article?.published_at]);

  async function copyArticleLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 1600);
    } catch {
      setCopiedUrl(false);
    }
  }

  return (
    <>
      <ArticleHeader theme={theme} toggle={toggle} />

      <main className="relative isolate min-h-screen overflow-hidden bg-canvas text-ink">
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
          <NetworkCanvas className="opacity-60" />
        </div>

        <article className="container-x relative z-10 pb-16 pt-32 sm:pb-24 sm:pt-36">
          {loading ? (
            <div className="mx-auto w-full max-w-6xl animate-pulse">
              <div className="h-4 w-40 rounded bg-[var(--bg-2)]" />
              <div className="mt-8 h-12 rounded bg-[var(--bg-2)] sm:h-16" />
              <div className="mt-4 h-5 w-3/4 rounded bg-[var(--bg-2)]" />
              <div className="mt-8 aspect-[16/9] rounded-2xl bg-[var(--bg-2)]" />
              <div className="mt-8 h-4 rounded bg-[var(--bg-2)]" />
              <div className="mt-3 h-4 w-5/6 rounded bg-[var(--bg-2)]" />
            </div>
          ) : error ? (
            <div className="card mx-auto max-w-2xl px-6 py-14 text-center">
              <Terminal size={32} className="mx-auto text-accent" />
              <h1 className="mt-5 text-2xl font-bold">Write-up unavailable</h1>
              <p className="mt-3 text-sm leading-7 text-muted">{error}</p>
              <Link
                to="/blog"
                className="btn btn-primary mt-6 inline-flex items-center justify-center"
              >
                Explore Write-ups
              </Link>
            </div>
          ) : article ? (
            <div className="mx-auto w-full max-w-6xl">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-accent"
                >
                  <ArrowLeft size={17} />
                  Back to Write-ups
                </Link>

                <button
                  type="button"
                  onClick={copyArticleLink}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-semibold text-muted transition hover:border-[var(--accent-line)] hover:text-accent sm:text-sm"
                >
                  {copiedUrl ? <Check size={15} /> : <Copy size={15} />}
                  {copiedUrl ? "Link copied" : "Share article"}
                </button>
              </div>

              {/* One outer card for the cover and complete article */}
              <section className="article-main-card relative w-full min-w-0 overflow-hidden rounded-3xl border border-line bg-card/90 p-5 text-left shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-8 lg:p-12">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-50 blur-[90px]"
                  style={{ background: "var(--glow)" }}
                  aria-hidden="true"
                />

                <header className="relative min-w-0">
                  <div className="eyebrow">
                    <Terminal size={15} />
                    Dev2Sec / {article.category || "Security Research"}
                  </div>

                  <h1 className="mt-5 max-w-4xl break-words text-left text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-6xl">
                    {article.title}
                  </h1>

                  {article.excerpt && (
                    <p className="lead mt-5 max-w-4xl text-left text-base sm:text-lg">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted">
                    {formattedDate && (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={16} className="text-accent" />
                        {formattedDate}
                      </span>
                    )}

                    {article.category && (
                      <span className="inline-flex items-center gap-2">
                        <Tag size={16} className="text-accent" />
                        {article.category}
                      </span>
                    )}
                  </div>

                  {article.cover_image_url && (
                    <div className="mt-8 w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-[var(--bg-2)]">
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        loading="eager"
                        className="block max-h-[560px] w-full object-contain sm:object-cover"
                      />
                    </div>
                  )}
                </header>

                {/* Article content sits directly in the outer card */}
                <div className="relative mt-8 min-w-0 border-t border-line pt-6 text-left sm:mt-10 sm:pt-8">
                  <ArticleCodeTools />

                  <div
                    className="article-content prose prose-sm max-w-none break-words text-justify leading-8 sm:prose-base
                      prose-headings:scroll-mt-24 prose-headings:text-left prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-ink
                      prose-h1:mb-5 prose-h1:mt-8 prose-h1:text-3xl
                      prose-h2:mb-4 prose-h2:mt-10 prose-h2:border-b prose-h2:border-line prose-h2:pb-3 prose-h2:text-2xl
                      prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-xl
                      prose-p:my-5 prose-p:text-left prose-p:text-muted
                      prose-a:font-semibold prose-a:text-accent prose-a:underline-offset-4
                      prose-strong:font-bold prose-strong:text-ink
                      prose-li:my-2 prose-li:text-muted
                      prose-ul:my-5 prose-ol:my-5
                      prose-blockquote:rounded-r-xl prose-blockquote:border-l-[var(--accent)] prose-blockquote:bg-[var(--bg-2)] prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:text-muted
                      prose-img:my-8 prose-img:max-h-[560px] prose-img:w-full prose-img:rounded-2xl prose-img:border prose-img:border-line prose-img:object-contain
                      prose-hr:border-line
                      [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto
                      [&_pre]:max-w-full [&_pre]:overflow-x-auto"
                    dangerouslySetInnerHTML={{
                      __html: article.content || "",
                    }}
                  />
                </div>

                {article.tags?.length > 0 && (
                  <div className="relative mt-10 border-t border-line pt-6 text-left sm:pt-8">
                    <p className="eyebrow">Topics covered</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span key={tag} className="chip">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <footer className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-7">
                <Link
                  to="/blog"
                  aria-label="Back to Write-ups"
                  title="Back to Write-ups"
                  className="article-nav-button inline-flex items-center gap-2 font-bold text-white transition hover:text-accent"
                >
                  <ArrowLeft size={23} strokeWidth={3} />
                  <span className="hidden sm:inline">Back to Write-ups</span>
                </Link>

                <Link
                  to="/"
                  aria-label="Go to Home"
                  title="Home"
                  className="article-nav-button inline-flex items-center gap-2 font-bold text-white transition hover:text-accent"
                >
                  <span className="hidden sm:inline">Home</span>
                  <Home size={23} strokeWidth={3} />
                </Link>
              </footer>
            </div>
          ) : null}
        </article>
      </main>
    </>
  );
}
