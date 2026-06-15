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
import ServicePreview from "../../components/Services/ServicePreview";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useServiceStore from "../../store/serviceStore";
import {
  primaryActionClass,
  secondaryActionClass,
} from "../../styles/adminControls";

const defaultService = {
  id: "",
  name: "",
  image: "",
  description: "",
  link: "",
  status: "active",
  order: 1,
};

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { fetchServiceById, saveService, isLoading, isSaving } =
    useServiceStore();
  const [service, setService] = useState(defaultService);
  const [imageFile, setImageFile] = useState(null);
  const isEdit = Boolean(id);

  useEffect(() => {
    let isMounted = true;

    const loadService = async () => {
      if (!id) {
        setService(defaultService);
        return;
      }

      try {
        const savedService = await fetchServiceById(axiosPrivate, id);
        if (isMounted) setService(savedService);
      } catch {
        if (isMounted) navigate("/services");
      }
    };

    loadService();
    return () => {
      isMounted = false;
    };
  }, [axiosPrivate, fetchServiceById, id, navigate]);

  const updateField = (field, value) => {
    setService((current) => ({ ...current, [field]: value }));
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
    reader.onload = () => updateField("image", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!service.name.trim() || !service.image.trim()) {
      toast.error("Service name and image are required");
      return;
    }

    try {
      await saveService(axiosPrivate, service, imageFile);
      navigate("/services");
    } catch {
      // The store reports API errors.
    }
  };

  if (isEdit && isLoading && !service.id) {
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
          title={isEdit ? "Edit service" : "Create service"}
          description="Configure a service card for the store home page."
          eyebrow={
            <button
              type="button"
              onClick={() => navigate("/services")}
              className="flex cursor-pointer items-center gap-2"
            >
              <FiArrowLeft />
              Back to services
            </button>
          }
          actions={
            <>
              <Button
                type="button"
                variant="outlined"
                className={secondaryActionClass}
                onClick={() => navigate("/services")}
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
                  "Create service"
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
              Service details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Service name"
                value={service.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Display order"
                type="number"
                value={service.order}
                onChange={(event) => updateField("order", event.target.value)}
                inputProps={{ min: 1 }}
                fullWidth
              />
              <TextField
                label="Description"
                value={service.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                multiline
                minRows={4}
                fullWidth
                className="sm:!col-span-2"
              />
              <TextField
                label="Destination link"
                value={service.link}
                onChange={(event) => updateField("link", event.target.value)}
                placeholder="/services/installation"
                helperText="Optional page opened when the card is clicked"
                fullWidth
                className="sm:!col-span-2"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={service.status === "active"}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.checked ? "active" : "draft",
                      )
                    }
                  />
                }
                label={
                  service.status === "active"
                    ? "Visible on storefront"
                    : "Saved as draft"
                }
              />
            </div>
          </Paper>

          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="text-lg font-bold text-slate-800">Service image</h2>
            <p className="mb-4 mt-1 text-sm text-slate-500">
              Recommended: square or 4:3 artwork, at least 800 px wide.
            </p>
            <TextField
              label="Image URL"
              value={service.image}
              onChange={(event) => updateField("image", event.target.value)}
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
        </div>

        <Paper elevation={2} className="!h-fit !rounded-xl !p-5 xl:!sticky xl:!top-5">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Preview</h2>
          <ServicePreview service={service} />
        </Paper>
      </div>
    </form>
  );
};

export default ServiceForm;
