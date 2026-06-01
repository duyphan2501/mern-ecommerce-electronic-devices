import { Fragment, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Select,
  Typography,
} from "@mui/material";
import { IoChevronDown, IoChevronForward, IoSearch } from "react-icons/io5";
import { formatDateTime } from "../../utils/DateFormat";
import formatMoney from "../../utils/MoneyFormat";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const STATUS_LABELS = {
  pending: "Pending Confirmation",
  confirmed: "Confirmed",
  packing: "Packing",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS = {
  pending: "warning",
  confirmed: "info",
  packing: "secondary",
  shipping: "primary",
  delivered: "success",
  cancelled: "error",
};

const eventLabel = (event) => {
  if (event.message) return event.message;
  if (event.from || event.to) return `${event.from || "-"} -> ${event.to || "-"}`;
  return event.type;
};

export default function OrderTable({
  orders,
  onOpenOrder,
  pagination = {},
  searchValue,
  onSearchChange,
  onPageChange,
  filterStatus,
  onFilterStatusChange,
  onRowsPerPageChange,
}) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [openId, setOpenId] = useState(null);
  const safePagination = {
    page: Number(pagination.page || 0),
    limit: Number(pagination.limit || 10),
    total: Number(pagination.total || 0),
  };

  const sortedOrders = useMemo(
    () => [...(orders || [])].sort(getComparator(order, orderBy)),
    [orders, order, orderBy],
  );

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Box>
      <Toolbar sx={{ px: 0, mb: 1 }}>
        <Typography variant="h6" sx={{ flex: "1 1 100%", fontWeight: 600 }}>
          Orders Table
        </Typography>
        <div className="flex justify-end items-center gap-5">
        <Box className="flex flex-wrap items-center gap-3">
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="order-status-filter-label">Status</InputLabel>
            <Select
              labelId="order-status-filter-label"
              label="Status"
              value={filterStatus}
              onChange={(event) =>
                onFilterStatusChange(event.target.value)
              }
            >
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="pending">Pending Confirmation</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="packing">Packing</MenuItem>
              <MenuItem value="shipping">Shipping</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box className="flex h-10 min-w-[320px] items-center rounded-md border border-gray-300 px-3">
          <IoSearch className="text-gray-400" />
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search order / customer / phone"
            className="ms-2 w-full outline-0"
          />
        </Box>
      </div>
      </Toolbar>

      <TableContainer className="rounded-md">
        <Table sx={{ "& .MuiTableCell-root": { py: 2.2 } }}>
          <TableHead className="bg-gray-100 text-nowrap">
            <TableRow>
              <TableCell />
              <TableCell>
                <TableSortLabel
                  active={orderBy === "orderId"}
                  direction={order}
                  onClick={() => handleRequestSort("orderId")}
                >
                  Order ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "createdAt"}
                  direction={order}
                  onClick={() => handleRequestSort("createdAt")}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "totalPrice"}
                  direction={order}
                  onClick={() => handleRequestSort("totalPrice")}
                >
                  Total
                </TableSortLabel>
              </TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedOrders.map((item) => {
              const isOpen = openId === item._id;
              const history = [...(item.statusHistory || [])].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
              );

              return (
                <Fragment key={item._id}>
                  <TableRow hover>
                    <TableCell width={40}>
                      <IconButton
                        size="small"
                        onClick={() => setOpenId(isOpen ? null : item._id)}
                      >
                        {isOpen ? (
                          <IoChevronDown size={18} />
                        ) : (
                          <IoChevronForward size={18} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{item.orderId}</TableCell>
                    <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                    <TableCell>{item.shippingInfo?.receiver || "-"}</TableCell>
                    <TableCell>{item.shippingInfo?.phone || "-"}</TableCell>
                    <TableCell className="text-nowrap">
                      {formatMoney(item.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Box className="flex flex-col gap-1">
                        <span>{item.payment?.provider}</span>
                        <Chip
                          label={item.payment?.status || "pending"}
                          size="small"
                          color={item.payment?.status === "paid" ? "success" : "default"}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[item.status] || item.status}
                        size="small"
                        color={STATUS_COLORS[item.status] || "default"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" onClick={() => onOpenOrder(item._id)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={9} className="!p-0" sx={{ borderBottom: 0 }}>
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Order Timeline
                          </Typography>
                          {history.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              No timeline events yet.
                            </Typography>
                          ) : (
                            <Box className="grid gap-3">
                              {history.map((event, index) => (
                                <Box
                                  key={`${event.createdAt}-${index}`}
                                  className="border-l-2 border-gray-300 pl-3"
                                >
                                  <Typography variant="body2" className="!font-semibold">
                                    {eventLabel(event)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {event.type} - {formatDateTime(event.createdAt)}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={safePagination.total}
        page={safePagination.page}
        rowsPerPage={safePagination.limit}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={(_, nextPage) => onPageChange(nextPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(Number(e.target.value))}
      />
    </Box>
  );
}
