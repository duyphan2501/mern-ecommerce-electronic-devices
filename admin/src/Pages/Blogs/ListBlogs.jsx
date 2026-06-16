import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminPageHeader from "../../components/AdminPageHeader";
import BlogPreview from "../../components/Blogs/BlogPreview";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useBlogStore from "../../store/blogStore";
import {
  compactControlSx,
  compactPrimaryActionClass,
  compactSecondaryActionClass,
  dangerActionClass,
  dangerIconActionClass,
  iconActionClass,
} from "../../styles/adminControls";

const ListBlogs = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { blogs, fetchBlogs, deleteBlog, isLoading } = useBlogStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    fetchBlogs(axiosPrivate).catch(() => {});
  }, [axiosPrivate, fetchBlogs]);

  const filteredBlogs = useMemo(() => {
    const search = query.trim().toLowerCase();
    return blogs.filter(
      (blog) =>
        (status === "all" || blog.status === status) &&
        (blog.title.toLowerCase().includes(search) ||
          (blog.excerpt || "").toLowerCase().includes(search) ||
          (blog.author || "").toLowerCase().includes(search)),
    );
  }, [blogs, query, status]);

  const counts = useMemo(
    () => ({
      total: blogs.length,
      published: blogs.filter((blog) => blog.status === "published").length,
      draft: blogs.filter((blog) => blog.status === "draft").length,
    }),
    [blogs],
  );

  const handleDelete = async () => {
    try {
      await deleteBlog(axiosPrivate, pendingDelete.id);
      setPendingDelete(null);
    } catch {
      // Keep the dialog open so the action can be retried.
    }
  };

  return (
    <Paper elevation={2} className="!m-5 !rounded-xl !p-5">
      <AdminPageHeader
        title="Blogs"
        description="Create and manage articles for the storefront blog."
        actions={
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => navigate("/blogs/add")}
            className={compactPrimaryActionClass}
          >
            Add blog
          </Button>
        }
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Total blogs", counts.total],
          ["Published", counts.published],
          ["Draft", counts.draft],
        ].map(([label, value]) => (
          <Paper key={label} elevation={1} className="!rounded-xl !p-4">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          </Paper>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex flex-wrap gap-3">
          <TextField
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search blogs"
            className="min-w-[260px] flex-1"
            sx={compactControlSx}
            slotProps={{
              input: {
                startAdornment: <FiSearch className="mr-2 text-slate-400" />,
              },
            }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-[180px]"
            sx={compactControlSx}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
          </TextField>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <CircularProgress />
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <BlogPreview blog={blog} compact />
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <Chip
                      size="small"
                      label={blog.status}
                      color={
                        blog.status === "published" ? "success" : "default"
                      }
                      className="!capitalize"
                    />
                    <div className="flex gap-2">
                      <Tooltip title="Edit">
                        <IconButton
                          className={iconActionClass}
                          onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                        >
                          <FiEdit2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          className={dangerIconActionClass}
                          onClick={() => setPendingDelete(blog)}
                        >
                          <FiTrash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-semibold text-slate-700">No blogs found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or create a new blog post.
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete blog?</DialogTitle>
        <DialogContent>
          This will remove <strong>{pendingDelete?.title}</strong> from the
          blog collection.
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className={compactSecondaryActionClass}
            onClick={() => setPendingDelete(null)}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            className={dangerActionClass}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ListBlogs;
