import {
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import AdminPageHeader from "../../components/AdminPageHeader";
import BlogPreview from "../../components/Blogs/BlogPreview";
import TiptapEditor from "../../components/TiptapEditor";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useBlogStore from "../../store/blogStore";
import {
  primaryActionClass,
  secondaryActionClass,
} from "../../styles/adminControls";
import slugify from "../../utils/Slugify";

const defaultBlog = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "",
  status: "published",
  publishedAt: null,
};

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { fetchBlogById, saveBlog, isLoading, isSaving } = useBlogStore();
  const [blog, setBlog] = useState(defaultBlog);
  const [imageFile, setImageFile] = useState(null);
  const isEdit = Boolean(id);

  useEffect(() => {
    let isMounted = true;

    const loadBlog = async () => {
      if (!id) {
        setBlog({ ...defaultBlog });
        return;
      }

      try {
        const savedBlog = await fetchBlogById(axiosPrivate, id);
        if (isMounted) setBlog(savedBlog);
      } catch {
        if (isMounted) navigate("/blogs");
      }
    };

    loadBlog();
    return () => {
      isMounted = false;
    };
  }, [axiosPrivate, fetchBlogById, id, navigate]);

  const updateField = (field, value) => {
    setBlog((current) => ({ ...current, [field]: value }));
  };

  const handleTitleChange = (value) => {
    setBlog((current) => ({
      ...current,
      title: value,
      slug: current.slug || slugify(value),
    }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => updateField("coverImage", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!blog.title.trim() || !blog.coverImage.trim()) {
      toast.error("Blog title and cover image are required");
      return;
    }

    try {
      await saveBlog(axiosPrivate, {
        ...blog,
        slug: blog.slug || slugify(blog.title),
      }, imageFile);
      navigate("/blogs");
    } catch {
      // The store reports API errors.
    }
  };

  if (isEdit && isLoading && !blog.id) {
    return (
      <div className="m-5 flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="m-5 pb-10">
      <div className="mb-5">
        <AdminPageHeader
          title={isEdit ? "Edit blog" : "Create blog"}
          description="Write and publish storefront blog articles."
          eyebrow={
            <button
              type="button"
              onClick={() => navigate("/blogs")}
              className="flex cursor-pointer items-center gap-2"
            >
              <FiArrowLeft />
              Back to blogs
            </button>
          }
          actions={
            <>
              <Button
                type="button"
                variant="outlined"
                className={secondaryActionClass}
                onClick={() => navigate("/blogs")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className={primaryActionClass}
                disabled={isSaving}
              >
                {isSaving ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isEdit ? (
                  "Save changes"
                ) : (
                  "Create blog"
                )}
              </Button>
            </>
          }
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.7fr)]">
        <div className="space-y-5">
          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Blog details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Title"
                value={blog.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                required
                fullWidth
                className="sm:!col-span-2"
              />
              <TextField
                label="Slug"
                value={blog.slug}
                onChange={(event) =>
                  updateField("slug", slugify(event.target.value))
                }
                placeholder="article-url-slug"
                fullWidth
              />
              <TextField
                label="Author"
                value={blog.author}
                onChange={(event) => updateField("author", event.target.value)}
                fullWidth
              />
              <TextField
                label="Excerpt"
                value={blog.excerpt}
                onChange={(event) => updateField("excerpt", event.target.value)}
                multiline
                minRows={3}
                fullWidth
                className="sm:!col-span-2"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={blog.status === "published"}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.checked ? "published" : "draft",
                      )
                    }
                  />
                }
                label={
                  blog.status === "published"
                    ? "Published on storefront"
                    : "Saved as draft"
                }
              />
            </div>
          </Paper>

          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="text-lg font-bold text-slate-800">Cover image</h2>
            <p className="mb-4 mt-1 text-sm text-slate-500">
              Recommended: 1200 x 675 px or wider landscape image.
            </p>
            <TextField
              label="Image URL"
              value={blog.coverImage}
              onChange={(event) =>
                updateField("coverImage", event.target.value)
              }
              required
              fullWidth
            />
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 font-semibold text-slate-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
              <FiUploadCloud size={22} />
              Upload from computer
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </label>
          </Paper>

          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Content</h2>
            <TiptapEditor
              key={blog.id || "new-blog"}
              content={blog.content}
              handleChangeValue={(value) => updateField("content", value)}
            />
          </Paper>
        </div>

        <Paper elevation={2} className="!h-fit !rounded-xl !p-5 xl:!sticky xl:!top-5">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Preview</h2>
          <BlogPreview blog={blog} />
        </Paper>
      </div>
    </form>
  );
};

export default BlogForm;
