import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { supabase } from "../lib/supabase";
import {
  Activity, ArrowDownRight, Bell, BookOpen, ChevronRight, Command, FileEdit,
  FileText, Globe, LayoutDashboard, LogOut, Menu, Plus, Search, Settings2,
  ShieldCheck, Sparkles, TrendingUp, X, Zap, Save, ImagePlus, Trash2, Pencil,
  Send, RotateCcw,
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Link as LinkIcon,
} from "lucide-react";

import { emptyForm, htmlToText, navigation, readableDate, slugify } from "./AdminDashboard.types";
import type { Article, ArticleForm, ArticleStatus, Section } from "./AdminDashboard.types";
import "./AdminDashboard.css";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [section, setSection] = useState<Section>("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[240px] px-4 py-4 text-sm leading-7 focus:outline-none",
        "aria-label": "Article rich text content",
      },
    },
    onUpdate: ({ editor: current }) => setForm((old) => ({ ...old, content: current.getHTML() })),
  });

  const notify = useCallback((type: "success" | "error", text: string) => {
    setNotice({ type, text });
    window.setTimeout(() => setNotice((old) => old?.text === text ? null : old), 5000);
  }, []);

  const loadArticles = useCallback(async () => {
    setLoadingArticles(true);
    try {
      const { data, error } = await supabase.from("articles")
        .select("id,title,slug,excerpt,content,cover_image_url,category,tags,status,published_at,created_at,updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setArticles((data ?? []) as Article[]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load articles.";
      notify("error", `Articles could not be loaded: ${message}`);
    } finally {
      setLoadingArticles(false);
    }
  }, [notify]);

  useEffect(() => {
    let active = true;
    async function checkAdmin() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) { navigate("/admin/login", { replace: true }); return; }
        const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceError || assurance.currentLevel !== "aal2") { navigate("/admin/login", { replace: true }); return; }
        const { data, error } = await supabase.functions.invoke("admin-api", { body: { action: "authorize" } });
        if (error || data?.authorized !== true) {
          await supabase.auth.signOut(); navigate("/admin/login", { replace: true }); return;
        }
        if (active) { setAuthorized(true); await loadArticles(); }
      } catch {
        navigate("/admin/login", { replace: true });
      } finally {
        if (active) setChecking(false);
      }
    }
    void checkAdmin();
    return () => { active = false; };
  }, [navigate, loadArticles]);

  async function logout() {
  await supabase.auth.signOut();
  navigate("/admin/login", { replace: true });
  }

  useEffect(() => {
    if (!authorized) return;

    const INACTIVITY_LIMIT = 4 * 60 * 1000;
    let timeoutId: number;

    const logoutForInactivity = async () => {
      await supabase.auth.signOut();
      navigate("/admin/login", {
        replace: true,
        state: { reason: "inactivity" },
      });
    };

    const resetTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        void logoutForInactivity();
      }, INACTIVITY_LIMIT);
    };

    const events = [
      "mousemove", "mousedown", "keydown",
      "scroll", "touchstart", "click",
    ] as const;

    events.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );

    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [authorized, navigate]);

  function selectSection(value: Section) {
    setSection(value);
    setSidebarOpen(false);
    setEditorOpen(false);
  }
  
  function updateForm<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) {
    setForm((old) => ({ ...old, [key]: value }));
  }
  function openNewArticle() {
    setEditingId(null); setForm(emptyForm); setEditorOpen(true); setSection("All articles");
    editor?.commands.setContent(""); setSidebarOpen(false); setNotice(null);
  }
  function openEditArticle(article: Article) {
    setEditingId(article.id);
    setForm({
      title: article.title, slug: article.slug, excerpt: article.excerpt,
      content: article.content, cover_image_url: article.cover_image_url,
      category: article.category, tags: article.tags.join(", "), status: article.status,
    });
    editor?.commands.setContent(article.content || "");
    setEditorOpen(true); setSection("All articles"); setNotice(null); setSidebarOpen(false);
  }
  useEffect(() => {
    if (editor && editorOpen) editor.commands.setContent(form.content || "", { emitUpdate: false });
  }, [editor, editorOpen]);


  async function uploadInlineImage(file?: File) {
    if (!file || !editor) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      notify("error", "Choose a JPG, PNG, WebP or AVIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `inline/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("blog-covers")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("blog-covers")
        .getPublicUrl(path);

      editor.chain().focus().setImage({
        src: data.publicUrl,
        alt: file.name.replace(/\.[^/.]+$/, ""),
      }).run();

      notify("success", "Image inserted into article.");
    } catch (error) {
      notify(
        "error",
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }


  async function uploadCover(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      notify("error", "Choose a JPG, PNG, WebP or AVIF image."); return;
    }
    if (file.size > 5 * 1024 * 1024) { notify("error", "Cover image must be 5 MB or smaller."); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("blog-covers").upload(path, file, {
        cacheControl: "3600", upsert: false, contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("blog-covers").getPublicUrl(path);
      updateForm("cover_image_url", data.publicUrl);
      notify("success", "Cover image uploaded.");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Image upload failed.");
    } finally { setUploading(false); }
  }

  async function saveArticle(nextStatus: ArticleStatus = form.status) {
    if (!form.title.trim()) { notify("error", "Article title is required."); return; }
    const generatedSlug = slugify(form.slug || form.title);
    if (!generatedSlug) { notify("error", "Please provide a valid title or slug."); return; }
    const plainText = htmlToText(form.content);
    if (nextStatus === "published" && !plainText) { notify("error", "Add article content before publishing."); return; }
    setSaving(true);
    try {
      const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError || assurance.currentLevel !== "aal2") throw new Error("MFA verification is required. Please sign in again.");
      const payload = {
        title: form.title.trim(), slug: generatedSlug, excerpt: form.excerpt.trim(),
        content: form.content || "", cover_image_url: form.cover_image_url.trim(),
        category: form.category.trim() || "General",
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 20),
        status: nextStatus,
        published_at: nextStatus === "published"
          ? (articles.find((article) => article.id === editingId)?.published_at || new Date().toISOString())
          : null,
      };
      let result;
      if (editingId) {
        result = await supabase.from("articles").update(payload).eq("id", editingId).select("id").single();
      } else {
        result = await supabase.from("articles").insert(payload).select("id").single();
      }
      if (result.error) {
        if (result.error.code === "23505") throw new Error("This slug is already used. Choose a different slug.");
        throw result.error;
      }
      await loadArticles();
      setEditorOpen(false); setEditingId(null); setForm(emptyForm); setSection("All articles");
      notify("success", nextStatus === "published" ? "Article published successfully." : "Draft saved successfully.");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Could not save article.");
    } finally { setSaving(false); }
  }

  async function changeStatus(article: Article, status: ArticleStatus) {
    try {
      const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError || assurance.currentLevel !== "aal2") throw new Error("MFA verification is required.");
      const { error } = await supabase.from("articles").update({
        status, published_at: status === "published" ? (article.published_at || new Date().toISOString()) : null,
      }).eq("id", article.id);
      if (error) throw error;
      await loadArticles(); notify("success", status === "published" ? "Article published." : "Article moved to drafts.");
    } catch (error) { notify("error", error instanceof Error ? error.message : "Status update failed."); }
  }

  async function deleteArticle(article: Article) {
    if (!window.confirm(`Delete “${article.title}” permanently? This cannot be undone.`)) return;
    try {
      const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError || assurance.currentLevel !== "aal2") throw new Error("MFA verification is required.");
      const { error } = await supabase.from("articles").delete().eq("id", article.id);
      if (error) throw error;
      await loadArticles(); notify("success", "Article deleted.");
    } catch (error) { notify("error", error instanceof Error ? error.message : "Delete failed."); }
  }

  const visibleArticles = useMemo(() => articles.filter((article) => {
    const matchesSection = section === "Published" ? article.status === "published"
      : section === "Drafts" ? article.status === "draft" : true;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [article.title, article.slug, article.category, article.excerpt, ...article.tags]
      .some((value) => value.toLowerCase().includes(q));
    return matchesSection && matchesSearch;
  }), [articles, section, search]);
  const publishedCount = articles.filter((article) => article.status === "published").length;
  const draftCount = articles.filter((article) => article.status === "draft").length;

  if (checking) return <main className="glass-admin flex min-h-screen items-center justify-center px-6 text-white"><div className="glass-panel flex items-center gap-4 rounded-2xl px-6 py-5"><span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300"/><div><p className="font-medium">Securing your workspace</p><p className="mt-1 text-xs text-white/45">Verifying administrator and MFA session…</p></div></div></main>;
  if (!authorized) return null;

  const buttonClass = "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-3.5 py-2.5 text-xs text-white/80 transition hover:bg-white/[.12] disabled:cursor-not-allowed disabled:opacity-50";
  const primaryClass = "inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200/20 bg-gradient-to-r from-violet-500 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:opacity-50";

  return (
    <main className="glass-admin relative min-h-screen overflow-hidden text-white selection:bg-violet-400/30">
      <div className="pointer-events-none fixed -left-32 top-1/3 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]"/>
      <div className="pointer-events-none fixed -right-24 top-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-[130px]"/>
      {sidebarOpen && <button aria-label="Close navigation overlay" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-md"/>}
      <div className="relative mx-auto min-h-screen max-w-[1800px] p-3 sm:p-5 lg:p-7">
        <aside className={`glass-panel fixed inset-y-3 left-3 z-50 flex w-[min(300px,calc(100vw-24px))] flex-col overflow-y-auto rounded-[28px] p-4 transition-transform duration-300 sm:inset-y-5 sm:left-5 sm:w-[300px] ${sidebarOpen ? "translate-x-0" : "-translate-x-[115%]"}`}>
          <div className="flex items-center justify-between px-2 pb-7 pt-2">
            <button onClick={() => selectSection("Overview")} className="flex items-center gap-3 text-left"><span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-violet-400/30 to-cyan-300/15"><Command size={21} className="text-cyan-100"/></span><span><span className="block text-sm font-extrabold tracking-[.16em]">Dev2Sec<span className="text-cyan-300">.</span></span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.24em] text-white/40">BLOG SECTION</span></span></button>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="rounded-xl p-2 text-white/60 hover:bg-white/10"><X size={17}/></button>
          </div>
          <div className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[.24em] text-white/35">Workspace</div>
          <nav className="space-y-2">{navigation.map(({ label, icon: Icon }) => <button key={label} onClick={() => selectSection(label)} className={`glass-nav flex min-h-[68px] w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-base font-bold ${section === label ? "glass-nav-active border-violet-300/30 text-white" : "border-white/10 text-white/70"}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"><Icon size={21}/></span><span className="flex-1">{label}</span>{section === label && <ChevronRight size={19} className="text-cyan-200"/>}</button>)}</nav>
          <div className="mb-3 mt-8 px-3 text-[9px] font-semibold uppercase tracking-[.24em] text-white/35">Preferences</div>
          <button onClick={() => selectSection("Settings")} className={`glass-nav flex min-h-[68px] w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-base font-bold ${section === "Settings" ? "glass-nav-active border-violet-300/30 text-white" : "border-white/10 text-white/70"}`}><Settings2 size={21}/>Settings</button>
          <div className="mt-auto pt-6"><button onClick={logout} className="glass-nav mt-3 flex min-h-[60px] w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-4 text-left text-base font-bold text-white/70 hover:border-rose-300/30 hover:text-rose-200"><LogOut size={22}/> Sign out securely</button><p className="px-3 pb-1 pt-2 text-[9px] tracking-wider text-white/25">Moawiz's Private Space</p></div>
        </aside>

        <div className="min-w-0 w-full">


          <header className="glass-panel admin-topbar sticky top-3 z-30 mb-5 grid min-h-[76px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-[24px] px-3 py-3 sm:top-4 sm:gap-3 sm:px-5 lg:px-6">
            {/* Left: Menu and logo */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              
              
              <button
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={sidebarOpen}
                title={sidebarOpen ? "Close menu" : "Open menu"}
                className="sidebar-toggle-button flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[.07] text-white/80"
              >
                <span className={`hamburger-icon ${sidebarOpen ? "is-open" : ""}`}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>



              <img
                src="/images/moawiz.png"
                alt="Moawiz logo"
                className="admin-avatar shrink-0 !h-8 !w-8 sm:!h-12 sm:!w-12 lg:!h-14 lg:!w-14"
              />
            </div>

            {/* Center: Welcome message */}
            <div className="min-w-0 text-center">
              <p className="header-welcome-text min-w-0 break-words text-center text-[12px] font-black tracking-tight text-white sm:text-sm sm:tracking-wide lg:text-xl">Admin's Private Space</p>
            </div>

            {/* Right: Security and action buttons */}
            <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
              

              <button
                aria-label="Notifications"
                title="Notifications"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[.04] text-white/65 transition hover:bg-white/10 sm:h-12 sm:w-12"
              >
                <Bell size={20} />
              </button>

              <button
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[.04] text-white/65 transition hover:bg-rose-400/10 hover:text-rose-200 sm:h-12 sm:w-12"
              >
                <LogOut size={20} />
              </button>
            </div>
          </header>



          {notice && <div role="status" className={`mb-4 flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-xs ${notice.type === "success" ? "border-emerald-200/20 bg-emerald-300/10 text-emerald-100" : "border-rose-200/20 bg-rose-300/10 text-rose-100"}`}><span>{notice.text}</span><button onClick={() => setNotice(null)} aria-label="Dismiss notification"><X size={15}/></button></div>}

          <div className="mx-auto max-w-[1600px] px-0 pb-8 sm:px-1">
            <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-cyan-200/[.06] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.22em] text-cyan-100"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300"/> Editorial command center</div><h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{editorOpen ? (editingId ? "Refine your story." : "Create a story.") : section === "Overview" ? <>Your ideas, <span className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-transparent">in their element.</span></> : section}</h1><p className="mt-3 max-w-xl text-xs leading-6 text-white/50 sm:text-sm">{editorOpen ? "Write, format and prepare your article for publication." : "Manage your articles and publishing workflow in one place."}</p></div>
              <div className="flex flex-wrap items-center gap-3"><label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] px-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-violet-300/30 hover:shadow-lg active:translate-y-0 sm:w-64 sm:flex-none"><Search size={19} className="shrink-0 text-white/50"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…" className="w-full min-w-0 border-0 bg-transparent text-base font-medium text-white outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 placeholder:text-sm placeholder:font-medium placeholder:text-white/45"/></label><button onClick={openNewArticle} className={`${primaryClass} new-article-animated`}><Plus size={17}/> New article</button></div>
            </div>

            {editorOpen ? (
              <section className="glass-panel article-editor-main-card article-editor-card rounded-[28px] p-5 sm:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[.2em] text-cyan-100/70">Content studio</p><h2 className="mt-1 text-xl font-semibold">{editingId ? "Edit article" : "New article"}</h2></div>
<button className={`${buttonClass} close-editor-animated`} onClick={() => { setEditorOpen(false); setEditingId(null); }}><X size={14}/> Close editor</button>
</div>
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="min-w-0 space-y-5">
                    <label className="block"><span className="mb-2 block text-sm font-semibold text-white/75">Article title *</span><input value={form.title} onChange={(e) => { const title = e.target.value; setForm((old) => ({ ...old, title, slug: old.slug || slugify(title) })); }} placeholder="e.g. Understanding Web Application Security" className="article-form-field w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-base font-medium text-white outline-none placeholder:text-sm placeholder:text-white/35"/></label>
                    <label className="block"><span className="mb-2 block text-sm font-semibold text-white/75">URL slug</span><input value={form.slug} onChange={(e) => updateForm("slug", slugify(e.target.value))} placeholder="article-url-slug" className="article-form-field w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-base font-medium text-white outline-none placeholder:text-sm placeholder:text-white/35"/><span className="mt-2 block text-xs text-white/45">URL preview: /blog/{slugify(form.slug || form.title) || "your-article"}</span></label>
                    <label className="block"><span className="mb-2 block text-sm font-semibold text-white/75">Excerpt / summary</span><textarea value={form.excerpt} onChange={(e) => updateForm("excerpt", e.target.value)} rows={4} maxLength={300} placeholder="A short summary for article cards and SEO…" className="article-form-field w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-base font-medium leading-7 text-white outline-none placeholder:text-sm placeholder:text-white/35"/></label>
                    <div><span className="mb-2 block text-base font-semibold text-white/80">Article content *</span><div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"><div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
                      <button type="button" title="Heading 1" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={buttonClass}><Heading1 size={15}/></button>
                      <button type="button" title="Heading 2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass}><Heading2 size={15}/></button>
                      <button type="button" title="Bold" onClick={() => editor?.chain().focus().toggleBold().run()} className={buttonClass}><Bold size={15}/></button>
                      <button type="button" title="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()} className={buttonClass}><Italic size={15}/></button>
                      <button type="button" title="Bullet list" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={buttonClass}><List size={15}/></button>
                      <button type="button" title="Numbered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={buttonClass}><ListOrdered size={15}/></button>
                      <button type="button" title="Block quote" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={buttonClass}><Quote size={15}/></button>
                      <button type="button" title="Add link" onClick={() => { const url = window.prompt("Enter link URL (https://…)"); if (url) editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run(); }} className={buttonClass}><LinkIcon size={15}/></button>
                      <label
                        title="Insert image into article"
                        className={`${buttonClass} cursor-pointer`}
                      >
                        <ImagePlus size={15} />
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            void uploadInlineImage(e.currentTarget.files?.[0]);
                            e.currentTarget.value = "";
                          }}
                        />
                      </label>
                      <button type="button" title="Undo" onClick={() => editor?.chain().focus().undo().run()} className={buttonClass}><RotateCcw size={15}/></button>
                    </div><div className="article-editor"><EditorContent editor={editor}/></div></div><p className="mt-3 text-sm font-medium leading-6 text-white/50">Use the toolbar to format headings, text, lists, quotes and links.</p></div>
                    <div className="flex flex-wrap gap-2">
<button onClick={() => saveArticle("draft")} disabled={saving || uploading} className={`${primaryClass} transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:translate-y-0`}><Save size={14}/>{saving ? "Saving…" : "Save draft"}</button>
<button onClick={() => saveArticle("published")} disabled={saving || uploading} className={`${primaryClass} transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:translate-y-0`}><Send size={14}/>{saving ? "Saving…" : "Publish article"}</button></div>
                  </div>
                  <aside className="space-y-5">
                    <div className="publishing-details-card rounded-2xl border border-white/10 bg-white/[.025] p-4"><h3 className="mb-4 text-xs font-semibold">Publishing details</h3>
                      <label className="mb-4 block"><span className="mb-2 block text-[11px] text-white/55">Category</span><input value={form.category} onChange={(e) => updateForm("category", e.target.value)} placeholder="Cybersecurity" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs outline-none"/></label>
                      <label className="mb-4 block"><span className="mb-2 block text-[11px] text-white/55">Tags (comma separated)</span><input value={form.tags} onChange={(e) => updateForm("tags", e.target.value)} placeholder="security, web, research" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs outline-none"/></label>
                      <div className="status-field"><span className="mb-2 block text-sm font-bold text-white/75">Status</span><div className="flex min-h-[50px] items-center rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base font-semibold capitalize text-white/85">{form.status}</div></div>
                    </div>
                    <div className="cover-image-animated rounded-2xl border border-white/10 bg-white/[.025] p-5"><div className="mb-4 flex items-center justify-between gap-2"><h3 className="text-base font-bold text-white">Cover image</h3><ImagePlus size={20} className="text-cyan-100"/></div>{form.cover_image_url ? <div className="mb-3 overflow-hidden rounded-xl border border-white/10"><img src={form.cover_image_url} alt="Article cover preview" className="max-h-48 w-full object-cover"/><button onClick={() => updateForm("cover_image_url", "")} className="m-2 text-xs font-semibold text-rose-200 hover:underline">Remove image URL</button></div> : <div className="mb-4 flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 text-center"><ImagePlus size={26} className="text-white/45"/><p className="mt-3 text-sm font-medium text-white/55">JPG, PNG, WebP or AVIF · max 5 MB</p></div>}<label className={`${buttonClass} choose-image-button w-full cursor-pointer justify-center text-base font-semibold`}>{uploading ? "Uploading…" : "Choose image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" disabled={uploading} onChange={(e) => { void uploadCover(e.target.files?.[0]); e.currentTarget.value = ""; }}/></label><label className="mt-4 block"><span className="mb-2 block text-sm font-semibold text-white/60">Or paste an image URL</span><input value={form.cover_image_url} onChange={(e) => updateForm("cover_image_url", e.target.value)} placeholder="https://…" className="article-form-field w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-base outline-none"/></label></div>
                    <div className="rounded-2xl border border-cyan-200/10 bg-cyan-300/[.04] p-5"><div className="flex items-center gap-3 text-cyan-100"><ShieldCheck size={20}/><span className="text-base font-bold">Secure publishing</span></div><p className="mt-3 text-sm font-medium leading-6 text-white/60">Saving requires an authenticated administrator session with MFA level AAL2. Database RLS remains the final access control.</p></div>
                  </aside>
                </div>
              </section>
            ) : section === "Overview" ? (
              <>
                <div className="mb-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  {[{ label: "Total articles", value: articles.length, icon: BookOpen, note: "Saved in your library" }, { label: "Published", value: publishedCount, icon: Globe, note: "Live articles" }, { label: "Drafts", value: draftCount, icon: FileEdit, note: "Work in progress" }, { label: "Total views", value: "—", icon: Activity, note: "Analytics not connected" }].map(({ label, value, icon: Icon, note }) => <article key={label} className="glass-panel glass-metric touch-manipulation rounded-[24px] border border-white/10 p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-white/85 sm:text-base">{label}</span><Icon size={24} strokeWidth={2.2} className="shrink-0 text-cyan-100 sm:h-7 sm:w-7"/></div><div className="mt-5 text-4xl font-bold sm:text-5xl">{value}</div><p className="mt-3 border-t border-white/10 pt-3 text-xs font-semibold text-white/55 sm:text-sm">{note}</p></article>)}
                </div>
                <section className="glass-panel publishing-universe-card mb-5 rounded-[28px] p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="content-studio-badge mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200/20 bg-violet-300/10 px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-violet-100"><Sparkles size={12}/> Content studio</div><h2 className="text-2xl font-semibold sm:text-3xl">Your publishing universe.</h2><p className="mt-3 max-w-xl text-xs leading-6 text-white/50">Create polished articles, keep drafts organized, and publish cybersecurity insights to your portfolio.</p></div><button onClick={openNewArticle} className={`${primaryClass} new-article-animated`}><Plus size={15}/> New article</button></div><div className="publishing-subcards mt-6 grid gap-3 sm:grid-cols-3"><div className="glass-soft rounded-2xl p-4"><ShieldCheck size={22} className="text-emerald-200"/><p className="mt-3 text-sm font-bold">Secure workspace</p><p className="mt-1 text-xs font-semibold text-white/55">MFA verified</p></div><div className="glass-soft rounded-2xl p-4"><FileText size={22} className="text-cyan-100"/><p className="mt-3 text-sm font-bold">Content studio</p><p className="mt-1 text-xs font-semibold text-white/55">Database connected</p></div><div className="glass-soft rounded-2xl p-4"><Zap size={22} className="text-fuchsia-100"/><p className="mt-3 text-sm font-bold">Growth insights</p><p className="mt-1 text-xs font-semibold text-white/55">Analytics not connected</p></div></div></section>
                <ArticleTable articles={articles.slice(0, 5)} loading={loadingArticles} onEdit={openEditArticle} onStatus={changeStatus} onDelete={deleteArticle} onViewAll={() => selectSection("All articles")} buttonClass={buttonClass}/>
              </>
            ) : section === "Analytics" ? (
              <section className="glass-panel analytics-main-card flex min-h-[300px] flex-col items-center justify-center rounded-[28px] p-8 text-center"><TrendingUp size={34} className="text-cyan-100"/><h2 className="mt-4 text-xl font-semibold">Analytics coming next</h2><p className="mt-2 max-w-md text-xs leading-6 text-white/45">Article counts are live. View tracking requires a separate privacy-aware page-view table or endpoint, so we won't display made-up traffic numbers.</p></section>
            ) : section === "Settings" ? (
              <section className="glass-panel settings-main-card space-y-3 rounded-[28px] p-6 sm:p-9"><div className="settings-heading mb-5 flex items-center gap-3"><Settings2 size={24} className="text-violet-100"/><div><h2 className="text-2xl font-bold">Workspace settings</h2><p className="mt-1 text-base font-medium text-white/60">Current publishing and security configuration.</p></div></div>{[["Admin authentication", "Supabase Auth"], ["Second factor", "Authenticator MFA · AAL2"], ["Server authorization", "admin-api Edge Function"], ["Article database", "public.articles · RLS enabled"], ["Cover images", "blog-covers · 5 MB maximum"], ["Analytics", "Not connected"]].map(([label, value]) => <div key={label} className="settings-item flex flex-col justify-between gap-2 rounded-2xl border border-white/10 px-4 py-5 sm:flex-row sm:items-center"><span className="text-base font-bold text-white/85">{label}</span><span className="text-sm font-semibold text-white/60">{value}</span></div>)}</section>
            ) : (
              <section className="glass-panel article-library-outer-card rounded-[28px] p-4 sm:p-7"><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-xl font-semibold">{section === "All articles" ? "Your article library" : `${section} articles`}</h2><p className="mt-1 text-xs text-white/45">{visibleArticles.length} article{visibleArticles.length === 1 ? "" : "s"} found</p></div><div className="flex gap-2"><button onClick={() => void loadArticles()} className={`${buttonClass} refresh-lift-button`}><RotateCcw size={14}/> Refresh</button><button onClick={openNewArticle} className={`${primaryClass} new-article-animated`}><Plus size={15}/> New article</button></div></div><ArticleTable articles={visibleArticles} loading={loadingArticles} onEdit={openEditArticle} onStatus={changeStatus} onDelete={deleteArticle} onViewAll={() => selectSection("All articles")} buttonClass={buttonClass}/></section>
            )}
            <footer className="mt-6 flex flex-col justify-between gap-2 px-2 text-[9px] text-white/30 sm:flex-row sm:items-center"><p>© {new Date().getFullYear()} Moawiz Studio · Crafted for thoughtful publishing.</p><p className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/> Secure admin session active <span className="mx-1 text-white/15">•</span><span className="flex items-center gap-1"><ArrowDownRight size={11}/> Private workspace</span></p></footer>
          </div>
        </div>
      </div>
    </main>
  );
}

function ArticleTable({
  articles, loading, onEdit, onStatus, onDelete, onViewAll, buttonClass,
}: {
  articles: Article[]; loading: boolean; onEdit: (article: Article) => void;
  onStatus: (article: Article, status: ArticleStatus) => void;
  onDelete: (article: Article) => void; onViewAll: () => void; buttonClass: string;
}) {
  return <section className="glass-panel articles-main-card overflow-hidden rounded-[26px]">
    <div className="articles-section-header flex flex-col justify-between gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:px-6"><div><h2 className="text-base font-bold text-white sm:text-lg">Articles</h2><p className="mt-1 text-xs font-semibold text-white/55 sm:text-sm">Real records from your Supabase database.</p></div><button onClick={onViewAll} className={`${buttonClass} articles-library-button`}>View article library <ChevronRight size={16}/></button></div>
    {loading ? <div className="p-12 text-center text-xs text-white/45">Loading articles…</div> : articles.length === 0 ? <div className="flex flex-col items-center px-5 py-12 text-center"><BookOpen size={28} className="text-violet-200/70"/><h3 className="mt-4 text-sm font-semibold">No articles found</h3><p className="mt-2 max-w-sm text-[11px] leading-6 text-white/45">Create your first draft to get started. If you expected existing records, refresh and check the database connection.</p></div> : <div className="divide-y divide-white/[.07]">{articles.map((article) => <article key={article.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"><div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[.04]">{article.cover_image_url ? <img src={article.cover_image_url} alt="" className="h-full w-full object-cover"/> : <FileText size={20} className="text-white/30"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-sm font-medium">{article.title}</h3><span className={`rounded-full border px-2 py-1 text-[9px] capitalize ${article.status === "published" ? "border-emerald-200/20 bg-emerald-300/10 text-emerald-100" : "border-amber-200/20 bg-amber-300/10 text-amber-100"}`}>{article.status}</span></div><p className="mt-1 truncate text-[10px] text-white/40">/{article.slug} · {article.category} · Updated {readableDate(article.updated_at)}</p>{article.excerpt && <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/55">{article.excerpt}</p>}</div><div className="flex flex-wrap gap-2 sm:justify-end"><button onClick={() => onEdit(article)} className={buttonClass} title="Edit article"><Pencil size={13}/> Edit</button>{article.status === "published" ? <button onClick={() => onStatus(article, "draft")} className={buttonClass} title="Unpublish article"><FileEdit size={13}/> Unpublish</button> : <button onClick={() => onStatus(article, "published")} className={buttonClass} title="Publish article"><Globe size={13}/> Publish</button>}<button onClick={() => onDelete(article)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200/15 bg-rose-300/[.06] px-3 py-2.5 text-xs text-rose-100/80 transition hover:bg-rose-300/15" title="Delete article"><Trash2 size={13}/></button></div></article>)}</div>}
  </section>;
}
