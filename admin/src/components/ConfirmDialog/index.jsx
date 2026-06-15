import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  compactSecondaryActionClass,
  dangerActionClass,
} from "../../styles/adminControls";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  content,
  action,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      disableEnforceFocus
      disableRestoreFocus
    >
      <DialogTitle id="confirm-dialog-title">Confirm</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          className={compactSecondaryActionClass}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          className={dangerActionClass}
          onClick={onConfirm}
          color="error"
        >
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
