import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatDateTime } from "../../utils/DateFormat";
import formatMoney from "../../utils/MoneyFormat";
import { movementTypeLabel } from "../../utils/inventoryUtils";

const MovementHistoryModal = ({ item, movements, onClose, open }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle fontWeight={700}>
        Stock history{item ? ` - ${item.productName} / ${item.modelName}` : ""}
      </DialogTitle>
      <DialogContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Unit cost</TableCell>
              <TableCell align="right">Unit sale</TableCell>
              <TableCell align="right">Profit</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.length > 0 ? (
              movements.map((movement) => (
                <TableRow key={movement._id}>
                  <TableCell>{formatDateTime(movement.createdAt)}</TableCell>
                  <TableCell>
                    {movementTypeLabel[movement.type] || movement.type}
                  </TableCell>
                  <TableCell align="right">
                    {movement.type === "import" ? "+" : "-"}
                    {movement.quantity}
                  </TableCell>
                  <TableCell align="right">
                    {formatMoney(movement.unitCost)}
                  </TableCell>
                  <TableCell align="right">
                    {formatMoney(movement.unitSalePrice || 0)}
                  </TableCell>
                  <TableCell align="right">
                    {formatMoney(movement.profit || 0)}
                  </TableCell>
                  <TableCell>{movement.note || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No movements yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default MovementHistoryModal;
