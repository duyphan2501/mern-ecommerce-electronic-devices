import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

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
      <DialogTitle id="confirm-dialog-title">Xác nhận</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onConfirm} color="error">
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
