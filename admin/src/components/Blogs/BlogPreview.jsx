const stripHtml = (value = "") =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const formatDate = (value) => {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const BlogPreview = ({ blog, compact = false }) => {
  const summary = blog.excerpt || stripHtml(blog.content);

  return (
    <div className="bg-white">
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          compact ? "aspect-[16/9]" : "aspect-[4/3] rounded-xl"
        }`}
      >
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title || "Blog cover"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
            Cover image
          </div>
        )}
      </div>
      <div className={compact ? "p-4" : "pt-4"}>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
          {formatDate(blog.publishedAt)}
        </p>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900">
          {blog.title || "Blog title"}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {summary || "Short excerpt or article body preview"}
        </p>
        {blog.author && (
          <p className="mt-3 text-sm font-semibold text-slate-500">
            By {blog.author}
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogPreview;
