import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Save,
  X,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Globe
} from "lucide-react";
import { api, BlogArticle } from "../../services/api";

interface BlogManagerProps {
  onShowToast: (text: string, type?: "success" | "error") => void;
}

const BlogManager: React.FC<BlogManagerProps> = ({ onShowToast }) => {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Guides");
  const [readTime, setReadTime] = useState("5 min read");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.blogs.adminGetAll();
      if (res.data.success && Array.isArray(res.data.blogs)) {
        setBlogs(res.data.blogs);
      }
    } catch {
      onShowToast("Failed to load blog articles", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleOpenCreate = () => {
    setCurrentBlogId(null);
    setTitle("");
    setSlug("");
    setCategory("Guides");
    setReadTime("5 min read");
    setExcerpt("");
    setContent("");
    setImage("/img/property_placeholder.jpg");
    setImageAlt("");
    setSeoTitle("");
    setSeoDescription("");
    setFocusKeyword("");
    setIsPublished(true);
    setIsEditing(true);
  };

  const handleOpenEdit = (b: BlogArticle) => {
    setCurrentBlogId(b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setCategory(b.category || "Guides");
    setReadTime(b.read_time || b.readTime || "5 min read");
    setExcerpt(b.excerpt || "");
    setContent(b.content || "");
    setImage(b.image || "");
    setImageAlt(b.image_alt || b.imageAlt || "");
    setSeoTitle(b.seo_title || b.seoTitle || "");
    setSeoDescription(b.seo_description || b.seoDescription || "");
    setFocusKeyword(b.focus_keyword || b.focusKeyword || "");
    setIsPublished(b.is_published ?? b.isPublished ?? true);
    setIsEditing(true);
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 100);
  };

  const handleAutoSlug = () => {
    if (title.trim()) {
      setSlug(slugify(title));
    }
  };

  const handleAutoGenerateSEO = () => {
    const generatedSlug = slug || slugify(title);
    const generatedTitle = `${title} | Sri Chakra Real Estate Blog`;
    const generatedDesc = excerpt || `Read our verified guide on ${title}. Expert real estate insights for buyers in Ranipet & Vellore from Sri Chakra Real Estate.`;
    const genAlt = `${title} - Sri Chakra Real Estate guide`;

    setSlug(generatedSlug);
    setSeoTitle(generatedTitle);
    setSeoDescription(generatedDesc);
    setImageAlt(genAlt);
    if (!focusKeyword) {
      setFocusKeyword(title.split(":")[0].toLowerCase().trim());
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast("Title is required", "error");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<BlogArticle> = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        category,
        read_time: readTime,
        excerpt: excerpt.trim(),
        content: content.trim(),
        image: image.trim(),
        image_alt: imageAlt.trim(),
        seo_title: seoTitle.trim() || `${title} | Sri Chakra Real Estate`,
        seo_description: seoDescription.trim() || excerpt.trim(),
        focus_keyword: focusKeyword.trim(),
        is_published: isPublished
      };

      if (currentBlogId) {
        const res = await api.blogs.adminUpdate(currentBlogId, payload);
        if (res.data.success) {
          onShowToast("Article updated successfully!", "success");
          setIsEditing(false);
          loadBlogs();
        } else {
          onShowToast(res.data.message || "Failed to update article", "error");
        }
      } else {
        const res = await api.blogs.adminCreate(payload);
        if (res.data.success) {
          onShowToast("Article created successfully!", "success");
          setIsEditing(false);
          loadBlogs();
        } else {
          onShowToast(res.data.message || "Failed to create article", "error");
        }
      }
    } catch (err: any) {
      onShowToast(err.response?.data?.error || "Error saving article", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, articleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${articleTitle}"?`)) return;

    setDeletingId(id);
    try {
      const res = await api.blogs.adminDelete(id);
      if (res.data.success) {
        onShowToast("Article deleted successfully", "success");
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        onShowToast(res.data.message || "Failed to delete article", "error");
      }
    } catch {
      onShowToast("Error deleting article", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-850 to-slate-900 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Content Marketing & Real Estate Guides
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Educational Blog Articles & Schema
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Attract top-of-funnel buyers searching for DTCP verification, registration charges, and land buying checklists with SEO-rich articles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Write New Article
            </button>
            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              Public Blog
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Editor Modal / View */}
      {isEditing && (
        <div className="bg-slate-800/90 border border-blue-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {currentBlogId ? "Editing Article" : "Create New Article"}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {title || "Untitled Real Estate Guide"}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoGenerateSEO}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                title="Auto-generate SEO title, meta description, and alt text from article details"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Generate SEO
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Article Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How to Verify DTCP Approval for a Plot in Ranipet"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                  >
                    Generate Slug
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="e.g. how-to-verify-dtcp-approval-ranipet"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category & Read Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="Guides">Guides</option>
                  <option value="Legal & Approval">Legal & Approval</option>
                  <option value="Market Insights">Market Insights</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 min read"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="e.g. verify DTCP approval"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Article Excerpt (Summary for Cards & SERP)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise 2-sentence summary outlining what buyers will learn..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Main Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Article Content (Full Text / Markdown)
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write informative headings (## Heading), bullet points, and actionable advice for buyers..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
              />
            </div>

            {/* Image & Image Alt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/img/chelliamman_nagar.jpg"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Image Alt Text (Google Images)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. DTCP approval certificate verification steps"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* SEO Meta Title & Description */}
            <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-2xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
                Search Engine Metadata
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Title tag for search engines"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    SEO Description
                  </label>
                  <input
                    type="text"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Search snippet description"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Publish & Save */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 text-emerald-500 rounded focus:ring-emerald-500 border-slate-700 bg-slate-900"
                />
                <span className="text-xs font-bold text-white">Publish Article Publicly</span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Article
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-3xl p-6 md:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Published Real Estate Guides</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Educational articles automatically generate <span className="font-mono text-blue-300">Article</span> Schema.org structured data.
            </p>
          </div>
          <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-semibold">
            {blogs.length} articles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Read Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Focus Keyword</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-slate-750/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white max-w-[280px]">
                    <div className="truncate">{b.title}</div>
                    <span className="text-[11px] font-mono text-purple-300">/blog/{b.slug}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                      {b.category || "Guides"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {b.read_time || b.readTime || "5 min read"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {(b.is_published ?? b.isPublished ?? true) ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Draft</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {b.focus_keyword || b.focusKeyword || <span className="italic text-slate-600">—</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 text-blue-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit article"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="View live post"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(b.id, b.title)}
                        disabled={deletingId === b.id}
                        className="p-1.5 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
