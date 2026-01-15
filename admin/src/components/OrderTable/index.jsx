import { Fragment, useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Toolbar,
  Typography,
  IconButton,
  Collapse,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { IoChevronDown, IoChevronForward, IoSearch } from "react-icons/io5";
import { formatDateTime } from "../../utils/DateFormat";

/* ================= SORT UTILS ================= */
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

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderTable({ orders }) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  /* ================= SEARCH ================= */
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (!searchValue) return orders;
    const q = searchValue.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.shippingInfo.receiver.toLowerCase().includes(q) ||
        o.shippingInfo.phone.includes(q)
    );
  }, [searchValue, orders]);

  /* ================= SORT ================= */
  const sortedOrders = useMemo(
    () => [...filteredOrders].sort(getComparator(order, orderBy)),
    [filteredOrders, order, orderBy]
  );

  /* ================= PAGINATION ================= */
  const visibleOrders = useMemo(
    () =>
      sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedOrders, page, rowsPerPage]
  );

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  /* ================= RENDER ================= */
  return (
    <Box>
      {/* ===== TOOLBAR (SEARCH) ===== */}
      <Toolbar sx={{ px: 0, mb: 1 }}>
        <Typography variant="h6" sx={{ flex: "1 1 100%", fontWeight: 600 }}>
          Orders Table
        </Typography>

        <Box className="border border-gray-300 rounded-xl h-10 flex items-center px-3 min-w-[320px]">
          <IoSearch className="text-gray-400" />
          <input
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setPage(0);
            }}
            placeholder="Search order / customer / phone"
            className="ms-2 outline-0 w-full"
          />
        </Box>
      </Toolbar>

      <TableContainer className="rounded-md">
        <Table
          sx={{
            "& .MuiTableCell-root": { py: 2.5 },
          }}
        >
          {/* ===== HEAD ===== */}
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
              <TableCell>Address</TableCell>
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
            </TableRow>
          </TableHead>

          {/* ===== BODY ===== */}

          {orders && orders.length > 0 && (
            <TableBody>
              {visibleOrders.map((order, index) => {
                const isOpen = openIndex === index;

                return (
                  <Fragment key={order.id}>
                    {/* MAIN ROW */}
                    <TableRow hover>
                      <TableCell width={40}>
                        <IconButton
                          size="small"
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                        >
                          {isOpen ? (
                            <IoChevronDown size={18} />
                          ) : (
                            <IoChevronForward size={18} />
                          )}
                        </IconButton>
                      </TableCell>

                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                      <TableCell>{order.shippingInfo.receiver}</TableCell>
                      <TableCell className="max-w-[260px] text-nowrap">
                        {order.shippingInfo.addressDetail},{" "}
                        {order.shippingInfo.ward}, {order.shippingInfo.province}
                      </TableCell>
                      <TableCell>{order.shippingInfo.phone}</TableCell>
                      <TableCell className="text-nowrap">
                        {order.totalPrice.toLocaleString()} đ
                      </TableCell>
                      <TableCell>{order.payment.provider}</TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <Select
                            id="demo-simple-select"
                            value={order.status}
                            size="small"
                            onChange={handleChange}
                            sx={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            {STATUS_OPTIONS.map((stat) => (
                              <MenuItem
                                key={stat.value}
                                value={stat.value}
                                sx={{ fontFamily: "Outfit, sans-serif" }}
                              >
                                {stat.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>

                    {/* ===== EXPAND ROW ===== */}
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="!p-0"
                        sx={{ p: 0, borderBottom: 0 }}
                      >
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{ mb: 1, fontWeight: 600 }}
                            >
                              Products
                            </Typography>

                            <Table size="small">
                              <TableHead sx={{ bgcolor: "#fafafa" }}>
                                <TableRow>
                                  <TableCell>Image</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Qty</TableCell>
                                  <TableCell>Price</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order.items?.map((p, i) => (
                                  <TableRow key={i}>
                                    <TableCell>
                                      <img
                                        src={p.image}
                                        alt={p.name}
                                        className="size-12 rounded-md"
                                      />
                                    </TableCell>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.quantity}</TableCell>
                                    <TableCell>
                                      {p.price.toLocaleString()} đ
                                    </TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {/* ===== PAGINATION ===== */}
      <TablePagination
        component="div"
        count={sortedOrders.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
      />
    </Box>
  );
}
