import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const defaultExportItem = {
  modelId: "",
  quantity: 1,
  unitSalePrice: 0,
  note: "",
};

const StockExportDialog = ({
  initialItem,
  items,
  isSaving,
  onClose,
  onSubmit,
  open,
}) => {
  const [note, setNote] = useState("");
  const [exportItems, setExportItems] = useState([{ ...defaultExportItem }]);

  useEffect(() => {
    if (!open) return;
    setNote("");
    setExportItems([
      initialItem
        ? {
            modelId: initialItem.modelId,
            quantity: 1,
            unitSalePrice: initialItem.salePrice || 0,
            note: "",
          }
        : { ...defaultExportItem },
    ]);
  }, [initialItem, open]);

  const selectedIds = exportItems.map((item) => item.modelId).filter(Boolean);

  const updateItem = (index, field, value) => {
    setExportItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const isValid =
    exportItems.length > 0 &&
    exportItems.every((item) => {
      const selectedItem = items.find((candidate) => candidate.modelId === item.modelId);
      const quantity = Number(item.quantity);

      return (
        item.modelId &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= Number(selectedItem?.stockQuantity || 0) &&
        Number(item.unitSalePrice) >= 0
      );
    });

  const handleSubmit = async () => {
    if (!isValid) return;
    const success = await onSubmit({
      note,
      items: exportItems.map((item) => ({
        modelId: item.modelId,
        quantity: Number(item.quantity),
        unitSalePrice: Number(item.unitSalePrice),
        note: item.note,
      })),
    });
    if (success) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={700}>Export Products</DialogTitle>
      <DialogContent>
        <TextField
          label="Export note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          fullWidth
          margin="dense"
          size="small"
        />

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {exportItems.map((exportItem, index) => {
            const selectedItem =
              items.find((item) => item.modelId === exportItem.modelId) ||
              null;
            const options = items.filter(
              (item) =>
                item.modelId === exportItem.modelId ||
                !selectedIds.includes(item.modelId),
            );

            return (
              <Box
                key={index}
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  md: "minmax(220px, 1fr) 120px 150px 1fr 40px",
                }}
                gap={1.5}
                alignItems="center"
              >
                <Autocomplete
                  options={options}
                  value={selectedItem}
                  getOptionLabel={(option) =>
                    `${option.productName} - ${option.modelName}`
                  }
                  onChange={(_, value) => {
                    updateItem(index, "modelId", value?.modelId || "");
                    updateItem(index, "unitSalePrice", value?.salePrice || 0);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Product model" size="small" />
                  )}
                />
                <TextField
                  label={`Qty${selectedItem ? ` / ${selectedItem.stockQuantity}` : ""}`}
                  type="number"
                  size="small"
                  value={exportItem.quantity}
                  inputProps={{ min: 1, step: 1 }}
                  onChange={(event) =>
                    updateItem(index, "quantity", event.target.value)
                  }
                />
                <TextField
                  label="Unit sale"
                  type="number"
                  size="small"
                  value={exportItem.unitSalePrice}
                  inputProps={{ min: 0 }}
                  onChange={(event) =>
                    updateItem(index, "unitSalePrice", event.target.value)
                  }
                />
                <TextField
                  label="Item note"
                  size="small"
                  value={exportItem.note}
                  onChange={(event) =>
                    updateItem(index, "note", event.target.value)
                  }
                />
                <IconButton
                  disabled={exportItems.length === 1}
                  onClick={() =>
                    setExportItems((prev) =>
                      prev.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            );
          })}
        </Box>

        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            setExportItems((prev) => [...prev, { ...defaultExportItem }])
          }
          className="!mt-4 !normal-case"
        >
          Add item
        </Button>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} className="!normal-case">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!isValid || isSaving}
          onClick={handleSubmit}
          className="!normal-case"
        >
          {isSaving ? "Saving..." : "Create export"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockExportDialog;
