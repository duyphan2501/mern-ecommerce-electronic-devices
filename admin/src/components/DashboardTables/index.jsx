import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import formatMoney from "../../utils/MoneyFormat";
import { formatDateTime } from "../../utils/DateFormat";

const STATUS_COLORS = {
  pending: "warning",
  confirmed: "info",
  packing: "secondary",
  shipping: "primary",
  delivered: "success",
  cancelled: "error",
};

const EmptyRow = ({ colSpan, text }) => (
  <TableRow>
    <TableCell colSpan={colSpan} align="center" className="!py-10 !text-gray-500">
      {text}
    </TableCell>
  </TableRow>
);

const RecentOrdersTable = ({ orders = [] }) => (
  <TableContainer>
    <Table size="small">
      <TableHead className="bg-gray-100">
        <TableRow>
          <TableCell>Order</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Created</TableCell>
          <TableCell align="right">Total</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!orders.length && <EmptyRow colSpan={5} text="No orders yet." />}
        {orders.map((order) => (
          <TableRow hover key={order._id}>
            <TableCell>
              <Link
                to={`/orders/${order._id}`}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                {order.orderId}
              </Link>
            </TableCell>
            <TableCell>{order.shippingInfo?.receiver || "-"}</TableCell>
            <TableCell>{formatDateTime(order.createdAt)}</TableCell>
            <TableCell align="right">{formatMoney(order.totalPrice)}</TableCell>
            <TableCell>
              <Chip
                size="small"
                label={order.status}
                color={STATUS_COLORS[order.status] || "default"}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const LowStockTable = ({ items = [] }) => (
  <TableContainer>
    <Table size="small">
      <TableHead className="bg-gray-100">
        <TableRow>
          <TableCell>Product</TableCell>
          <TableCell align="right">In stock</TableCell>
          <TableCell align="right">Minimum</TableCell>
          <TableCell align="right">Target</TableCell>
          <TableCell align="right">Price</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!items.length && (
          <EmptyRow colSpan={5} text="All products are above minimum stock." />
        )}
        {items.map((item) => (
          <TableRow hover key={item.modelId}>
            <TableCell>
              <div className="flex min-w-[240px] items-center gap-3">
                <div className="size-11 overflow-hidden rounded border border-gray-200">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full object-contain"
                    />
                  )}
                </div>
                <Link
                  to={`/products/edit/${item.productId}`}
                  className="font-semibold hover:text-blue-600"
                >
                  {item.name}
                </Link>
              </div>
            </TableCell>
            <TableCell align="right">
              <span className="font-bold text-red-600">{item.stockQuantity}</span>
            </TableCell>
            <TableCell align="right">{item.minimumQuantity}</TableCell>
            <TableCell align="right">{item.expectedQuantity}</TableCell>
            <TableCell align="right">{formatMoney(item.salePrice)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export { LowStockTable, RecentOrdersTable };
