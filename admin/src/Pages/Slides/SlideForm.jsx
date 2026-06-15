import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import SlidePreview from "../../components/Slides/SlidePreview";
import {
  slideTypes,
} from "../../data/slideRepository";
import AdminPageHeader from "../../components/AdminPageHeader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useSlideStore from "../../store/slideStore";
import {
  primaryActionClass,
  secondaryActionClass,
} from "../../styles/adminControls";

const defaultSlide = {
  id: "",
  name: "",
  type: "hero",
  image: "",
  mobileImage: "",
  title: "",
  content: "",
  footer: "",
  link: "",
  linkContent: "",
  status: "active",
  order: 1,
};

const SlideForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { fetchSlideById, saveSlide, isLoading, isSaving } = useSlideStore();
  const [slide, setSlide] = useState(defaultSlide);
  const [imageFile, setImageFile] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const isEdit = Boolean(id);

  useEffect(() => {
    let isMounted = true;

    const loadSlide = async () => {
      if (!id) {
        setSlide(defaultSlide);
        return;
      }

      try {
        const savedSlide = await fetchSlideById(axiosPrivate, id);
        if (isMounted) setSlide(savedSlide);
      } catch {
        if (isMounted) navigate("/home-slides/all");
      }
    };

    loadSlide();
    return () => {
      isMounted = false;
    };
  }, [axiosPrivate, fetchSlideById, id, navigate]);

  const updateField = (field, value) => {
    setSlide((current) => ({ ...current, [field]: value }));
  };

  const handleFile = (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (field === "image") setImageFile(file);
    else setMobileImageFile(file);

    const reader = new FileReader();
    reader.onload = () => updateField(field, reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!slide.name.trim() || !slide.image.trim()) {
      toast.error("Slide name and image are required");
      return;
    }

    if (
      slide.type === "feature" &&
      (!slide.content.trim() || !slide.linkContent.trim())
    ) {
      toast.error("Feature ads need a headline and button label");
      return;
    }

    try {
      await saveSlide(axiosPrivate, slide, {
        imageFile,
        mobileImageFile,
      });
      navigate("/home-slides/all");
    } catch {
      // The store reports API errors.
    }
  };

  if (isEdit && isLoading && !slide.id) {
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
          title={isEdit ? "Edit slide" : "Create slide"}
          description="Configure content for one of the home page slide placements."
          eyebrow={
            <button
              type="button"
              onClick={() => navigate("/home-slides/all")}
              className="flex cursor-pointer items-center gap-2"
            >
              <FiArrowLeft />
              Back to slides
            </button>
          }
          actions={
            <>
              <Button
                type="button"
                variant="outlined"
                className={secondaryActionClass}
                onClick={() => navigate("/home-slides/all")}
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
                  "Create slide"
                )}
              </Button>
            </>
          }
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(440px,0.85fr)]">
        <div className="space-y-5">
          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Slide details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Internal name"
                value={slide.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
                fullWidth
                helperText="Only shown in the admin dashboard"
              />
              <FormControl fullWidth>
                <InputLabel>Slide type</InputLabel>
                <Select
                  value={slide.type}
                  label="Slide type"
                  onChange={(event) => updateField("type", event.target.value)}
                >
                  {Object.entries(slideTypes).map(([value, type]) => (
                    <MenuItem key={value} value={value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Display order"
                type="number"
                value={slide.order}
                onChange={(event) => updateField("order", event.target.value)}
                inputProps={{ min: 1 }}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={slide.status === "active"}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.checked ? "active" : "draft",
                      )
                    }
                  />
                }
                label={
                  slide.status === "active" ? "Active slide" : "Saved as draft"
                }
              />
            </div>
          </Paper>

          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="text-lg font-bold text-slate-800">Artwork</h2>
            <p className="mb-4 mt-1 text-sm text-slate-500">
              Recommended:{" "}
              {slide.type === "hero"
                ? "1920 x 800 px"
                : slide.type === "feature"
                  ? "1200 x 675 px"
                  : "800 x 600 px"}
            </p>
            <TextField
              label="Image URL"
              value={slide.image}
              onChange={(event) => updateField("image", event.target.value)}
              fullWidth
              required
            />
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 font-semibold text-slate-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
              <FiUploadCloud size={22} />
              Upload from computer
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFile(event, "image")}
              />
            </label>
            <TextField
              label="Mobile image URL"
              value={slide.mobileImage}
              onChange={(event) =>
                updateField("mobileImage", event.target.value)
              }
              fullWidth
              className="!mt-4"
              helperText="Optional portrait crop for smaller screens"
            />
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-4 font-semibold text-slate-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
              <FiUploadCloud size={20} />
              Upload mobile image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFile(event, "mobileImage")}
              />
            </label>
          </Paper>

          {slide.type === "feature" && (
            <Paper elevation={2} className="!rounded-xl !p-5">
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                Feature content
              </h2>
              <div className="!space-y-4">
                <TextField
                  label="Eyebrow title"
                  value={slide.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Headline"
                  value={slide.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  fullWidth
                  required
                  multiline
                  minRows={2}
                />
                <TextField
                  label="Supporting text"
                  value={slide.footer}
                  onChange={(event) => updateField("footer", event.target.value)}
                  fullWidth
                />
              </div>
            </Paper>
          )}

          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Destination
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Link"
                value={slide.link}
                onChange={(event) => updateField("link", event.target.value)}
                placeholder="/products"
                fullWidth
                helperText={
                  slide.type === "hero"
                    ? "Makes the hero banner clickable"
                    : "Page opened when the promotion is clicked"
                }
              />
              {slide.type === "feature" && (
                <TextField
                  label="Button label"
                  value={slide.linkContent}
                  onChange={(event) =>
                    updateField("linkContent", event.target.value)
                  }
                  required
                  fullWidth
                />
              )}
            </div>
          </Paper>
        </div>

        <div>
          <Paper
            elevation={2}
            className="!sticky !top-5 !rounded-xl !p-5"
          >
            <SlidePreview slide={slide} />
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Placement behavior</p>
              <p className="mt-1">
                {slide.type === "hero" &&
                  "Rotates in the main home carousel with pagination and autoplay."}
                {slide.type === "feature" &&
                  "Rotates in the large promotional area with animated copy and CTA."}
                {slide.type === "side" &&
                  "Stacks beside the feature carousel as a compact linked promotion."}
              </p>
            </div>
          </Paper>
        </div>
      </div>
    </form>
  );
};

export default SlideForm;
