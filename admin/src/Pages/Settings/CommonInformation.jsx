import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSave } from "react-icons/fi";
import AdminPageHeader from "../../components/AdminPageHeader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useSettingStore, {
  defaultCommonInformation,
} from "../../store/settingStore";
import { primaryActionClass } from "../../styles/adminControls";

const identityFields = [
  ["storeName", "Store name", true],
  ["tagline", "Tagline"],
  ["logo", "Logo URL"],
  ["favicon", "Favicon URL"],
];

const contactFields = [
  ["email", "Email"],
  ["phone", "Phone"],
  ["hotline", "Hotline"],
  ["openingHours", "Opening hours"],
];

const socialFields = [
  ["facebook", "Facebook URL"],
  ["instagram", "Instagram URL"],
  ["youtube", "YouTube URL"],
  ["tiktok", "TikTok URL"],
];

const CommonInformation = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    fetchCommonInformation,
    saveCommonInformation,
    isLoading,
    isSaving,
  } = useSettingStore();
  const [form, setForm] = useState(defaultCommonInformation);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const savedInformation = await fetchCommonInformation(axiosPrivate);
        if (isMounted) setForm(savedInformation);
      } catch {
        if (isMounted) setForm(defaultCommonInformation);
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, [axiosPrivate, fetchCommonInformation]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.storeName.trim()) {
      toast.error("Store name is required");
      return;
    }

    try {
      const savedInformation = await saveCommonInformation(axiosPrivate, form);
      setForm(savedInformation);
    } catch {
      // The store reports API errors.
    }
  };

  if (isLoading) {
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
          title="Common information"
          description="Manage the store identity and contact details used across the storefront."
          actions={
            <Button
              type="submit"
              variant="contained"
              startIcon={
                isSaving ? <CircularProgress size={18} color="inherit" /> : <FiSave />
              }
              className={primaryActionClass}
              disabled={isSaving}
            >
              Save changes
            </Button>
          }
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.45fr)]">
        <div className="space-y-5">
          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Store identity
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {identityFields.map(([field, label, required]) => (
                <TextField
                  key={field}
                  label={label}
                  value={form[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                  required={Boolean(required)}
                  fullWidth
                />
              ))}
            </div>
          </Paper>

          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Contact information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {contactFields.map(([field, label]) => (
                <TextField
                  key={field}
                  label={label}
                  value={form[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                  fullWidth
                />
              ))}
              <TextField
                label="Address"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                multiline
                minRows={3}
                fullWidth
                className="sm:!col-span-2"
              />
            </div>
          </Paper>

          <Paper elevation={2} className="!rounded-xl !p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Social links
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {socialFields.map(([field, label]) => (
                <TextField
                  key={field}
                  label={label}
                  value={form[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                  fullWidth
                />
              ))}
            </div>
          </Paper>
        </div>

        <Paper elevation={2} className="!h-fit !rounded-xl !p-5 xl:!sticky xl:!top-24">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Preview</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt=""
                    className="size-full object-contain"
                  />
                ) : (
                  <span className="text-xl font-bold text-slate-400">
                    {form.storeName?.charAt(0)?.toUpperCase() || "S"}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900">
                  {form.storeName || "Store name"}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {form.tagline || "Store tagline"}
                </p>
              </div>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <p>{form.email || "contact@example.com"}</p>
              <p>{form.phone || "Phone number"}</p>
              <p>{form.address || "Store address"}</p>
              <p>{form.openingHours || "Opening hours"}</p>
            </div>
          </div>
        </Paper>
      </div>
    </form>
  );
};

export default CommonInformation;
