import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminPageHeader from "../../components/AdminPageHeader";
import ServicePreview from "../../components/Services/ServicePreview";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useServiceStore from "../../store/serviceStore";
import {
  compactControlSx,
  compactPrimaryActionClass,
  compactSecondaryActionClass,
  dangerActionClass,
  dangerIconActionClass,
  iconActionClass,
} from "../../styles/adminControls";

const ListServices = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { services, fetchServices, deleteService, isLoading } =
    useServiceStore();
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    fetchServices(axiosPrivate).catch(() => {});
  }, [axiosPrivate, fetchServices]);

  const filteredServices = useMemo(() => {
    const search = query.trim().toLowerCase();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(search) ||
        (service.description || "").toLowerCase().includes(search),
    );
  }, [query, services]);

  const activeCount = services.filter(
    (service) => service.status === "active",
  ).length;

  const handleDelete = async () => {
    try {
      await deleteService(axiosPrivate, pendingDelete.id);
      setPendingDelete(null);
    } catch {
      // Keep the dialog open so the action can be retried.
    }
  };

  return (
    <Paper elevation={2} className="!m-5 !rounded-xl !p-5">
      <AdminPageHeader
        title="Services"
        description="Manage the service cards displayed on the store home page."
        actions={
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => navigate("/services/add")}
            className={compactPrimaryActionClass}
          >
            Add service
          </Button>
        }
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Total services", services.length],
          ["Active", activeCount],
          ["Draft", services.length - activeCount],
        ].map(([label, value]) => (
          <Paper key={label} elevation={1} className="!rounded-xl !p-4">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          </Paper>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <TextField
          size="small"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search services"
          className="w-full max-w-xl"
          sx={compactControlSx}
          slotProps={{
            input: {
              startAdornment: <FiSearch className="mr-2 text-slate-400" />,
            },
          }}
        />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <CircularProgress />
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <ServicePreview service={service} compact />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">
                      Position {service.order}
                    </p>
                    <Chip
                      size="small"
                      label={service.status}
                      color={
                        service.status === "active" ? "success" : "default"
                      }
                      className="!capitalize"
                    />
                  </div>
                  <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                    <Tooltip title="Edit">
                      <IconButton
                        className={iconActionClass}
                        onClick={() => navigate(`/services/edit/${service.id}`)}
                      >
                        <FiEdit2 size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        className={dangerIconActionClass}
                        onClick={() => setPendingDelete(service)}
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
            <p className="font-semibold text-slate-700">No services found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or create a new service.
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete service?</DialogTitle>
        <DialogContent>
          This will remove <strong>{pendingDelete?.name}</strong> from the
          service configuration.
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

export default ListServices;
