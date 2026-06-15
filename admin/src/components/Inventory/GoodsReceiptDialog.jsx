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
import {
  compactPrimaryActionClass,
  compactSecondaryActionClass,
  dangerIconActionClass,
} from "../../styles/adminControls";

const defaultReceiptItem = {
  modelId: "",
  quantity: 1,
  unitCost: 0,
  note: "",
};

const GoodsReceiptDialog = ({ open, onClose, items, onSubmit, isSaving }) => {
  const [note, setNote] = useState("");
  const [receiptItems, setReceiptItems] = useState([{ ...defaultReceiptItem }]);

  useEffect(() => {
    if (open) {
      setNote("");
      setReceiptItems([{ ...defaultReceiptItem }]);
    }
  }, [open]);

  const selectedIds = receiptItems.map((item) => item.modelId).filter(Boolean);

  const updateItem = (index, field, value) => {
    setReceiptItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const isValid =
    receiptItems.length > 0 &&
    receiptItems.every(
      (item) =>
        item.modelId &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0 &&
        Number(item.unitCost) >= 0,
    );

  const handleSubmit = async () => {
    if (!isValid) return;
    const success = await onSubmit({
      note,
      items: receiptItems.map((item) => ({
        modelId: item.modelId,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        note: item.note,
      })),
    });
    if (success) onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={700}>Create Goods Receipt</DialogTitle>
      <DialogContent>
        <TextField
          label="Receipt note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          fullWidth
          margin="dense"
          size="small"
        />

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          {receiptItems.map((receiptItem, index) => {
            const selectedItem =
              items.find((item) => item.modelId === receiptItem.modelId) ||
              null;
            const options = items.filter(
              (item) =>
                item.modelId === receiptItem.modelId ||
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
                  onChange={(_, value) =>
                    updateItem(index, "modelId", value?.modelId || "")
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Product model" size="small" />
                  )}
                />
                <TextField
                  label="Qty"
                  type="number"
                  size="small"
                  value={receiptItem.quantity}
                  inputProps={{ min: 1, step: 1 }}
                  onChange={(event) =>
                    updateItem(index, "quantity", event.target.value)
                  }
                />
                <TextField
                  label="Unit cost"
                  type="number"
                  size="small"
                  value={receiptItem.unitCost}
                  inputProps={{ min: 0 }}
                  onChange={(event) =>
                    updateItem(index, "unitCost", event.target.value)
                  }
                />
                <TextField
                  label="Item note"
                  size="small"
                  value={receiptItem.note}
                  onChange={(event) =>
                    updateItem(index, "note", event.target.value)
                  }
                />
                <IconButton
                  className={dangerIconActionClass}
                  disabled={receiptItems.length === 1}
                  onClick={() =>
                    setReceiptItems((prev) =>
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
            setReceiptItems((prev) => [...prev, { ...defaultReceiptItem }])
          }
          className={`${compactSecondaryActionClass} !mt-4`}
        >
          Add item
        </Button>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          className={compactSecondaryActionClass}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!isValid || isSaving}
          onClick={handleSubmit}
          className={compactPrimaryActionClass}
        >
          {isSaving ? "Saving..." : "Create receipt"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoodsReceiptDialog;
