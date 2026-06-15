import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  FiCopy,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SlidePreview from "../../components/Slides/SlidePreview";
import { slideTypes } from "../../data/slideRepository";
import AdminPageHeader from "../../components/AdminPageHeader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useSlideStore from "../../store/slideStore";
import {
  compactPrimaryActionClass,
  compactSecondaryActionClass,
  compactControlSx,
  dangerActionClass,
  dangerIconActionClass,
  iconActionClass,
} from "../../styles/adminControls";

const ListSlides = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const {
    slides,
    fetchSlides,
    duplicateSlide,
    deleteSlide,
    isLoading,
  } = useSlideStore();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    fetchSlides(axiosPrivate).catch(() => {});
  }, [axiosPrivate, fetchSlides]);

  const filteredSlides = useMemo(
    () =>
      slides.filter(
        (slide) =>
          (type === "all" || slide.type === type) &&
          slide.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, slides, type],
  );

  const counts = useMemo(
    () => ({
      total: slides.length,
      active: slides.filter((slide) => slide.status === "active").length,
      hero: slides.filter((slide) => slide.type === "hero").length,
      promotions: slides.filter((slide) => slide.type !== "hero").length,
    }),
    [slides],
  );

  const handleDuplicate = async (id) => {
    try {
      await duplicateSlide(axiosPrivate, id);
    } catch {
      // The store reports API errors.
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSlide(axiosPrivate, pendingDelete.id);
      setPendingDelete(null);
    } catch {
      // Keep the dialog open so the action can be retried.
    }
  };

  return (
    <Paper elevation={2} className="!m-5 !rounded-xl !p-5">
      <AdminPageHeader
        title="Home slides"
        description="Manage the hero carousel and promotional placements on the store."
        actions={
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => navigate("/home-slides/add")}
            className={compactPrimaryActionClass}
          >
            Add slide
          </Button>
        }
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total slides", counts.total],
          ["Active", counts.active],
          ["Hero banners", counts.hero],
          ["Promotions", counts.promotions],
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
            placeholder="Search slides"
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
            label="Placement"
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-[190px]"
            sx={compactControlSx}
          >
            <MenuItem value="all">All placements</MenuItem>
            {Object.entries(slideTypes).map(([value, item]) => (
              <MenuItem key={value} value={value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <CircularProgress />
          </div>
        ) : filteredSlides.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredSlides.map((slide) => (
              <article
                key={slide.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <SlidePreview slide={slide} compact />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-bold text-slate-900">
                        {slide.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {slideTypes[slide.type].label} - Position {slide.order}
                      </p>
                    </div>
                    <Chip
                      size="small"
                      label={slide.status}
                      color={slide.status === "active" ? "success" : "default"}
                      className="!capitalize"
                    />
                  </div>
                  <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                    <Tooltip title="Duplicate">
                      <IconButton
                        className={iconActionClass}
                        onClick={() => handleDuplicate(slide.id)}
                      >
                        <FiCopy size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        className={iconActionClass}
                        onClick={() =>
                          navigate(`/home-slides/edit/${slide.id}`)
                        }
                      >
                        <FiEdit2 size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        className={dangerIconActionClass}
                        onClick={() => setPendingDelete(slide)}
                      >
                        <FiTrash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-semibold text-slate-700">No slides found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or create a new slide.
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete slide?</DialogTitle>
        <DialogContent>
          This will remove <strong>{pendingDelete?.name}</strong> from the home
          page configuration.
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

export default ListSlides;
