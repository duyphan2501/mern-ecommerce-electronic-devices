import { Fragment, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import OutputIcon from "@mui/icons-material/Output";
import { IoChevronDown, IoChevronForward, IoSearch } from "react-icons/io5";
import StockProgress from "../StockTable/StockProgress";
import formatMoney from "../../utils/MoneyFormat";
import {
  getComparator,
  groupInventoryItems,
  statusMap,
} from "../../utils/inventoryUtils";
import ProductCell from "./ProductCell";

const headCells = [
  { id: "productName", label: "Product" },
  { id: "modelCount", label: "Models", align: "right" },
  { id: "totalStock", label: "Total Stock", align: "right" },
  { id: "totalStockValue", label: "Stock Value", align: "right" },
  { id: "status", label: "Status", align: "right" },
];

const InventoryProductTable = ({
  items,
  onOpenExport,
  onOpenHistory,
  searchValue,
  setSearchValue,
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("productName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openProductId, setOpenProductId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const productGroups = useMemo(() => groupInventoryItems(items), [items]);

  const filteredGroups = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return productGroups.filter((group) => {
      const matchesSearch =
        !query ||
        group.productName.toLowerCase().includes(query) ||
        group.brand.toLowerCase().includes(query) ||
        group.models.some((model) =>
          model.modelName.toLowerCase().includes(query),
        );
      const matchesStatus =
        statusFilter === "all" ||
        group.status === statusFilter ||
        group.models.some((model) => model.status === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [productGroups, searchValue, statusFilter]);

  const sortedGroups = useMemo(
    () => [...filteredGroups].sort(getComparator(order, orderBy)),
    [filteredGroups, order, orderBy],
  );

  const visibleGroups = useMemo(
    () =>
      sortedGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, sortedGroups],
  );

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Box>
      <Toolbar sx={{ px: 0, mb: 1, gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h6" sx={{ flex: "1 1 220px", fontWeight: 700 }}>
          Inventory by Product
        </Typography>

        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="in_stock">In stock</MenuItem>
          <MenuItem value="low_stock">Low stock</MenuItem>
          <MenuItem value="out_of_stock">Out of stock</MenuItem>
        </TextField>

        <Box className="border border-gray-300 rounded-xl h-10 flex items-center px-3 min-w-[320px]">
          <IoSearch className="text-gray-400" />
          <input
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setPage(0);
            }}
            placeholder="Search product, model, brand"
            className="ms-2 outline-0 w-full"
          />
        </Box>
      </Toolbar>

      <TableContainer className="rounded-md">
        <Table sx={{ minWidth: 980 }}>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell width={44} />
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || "left"}
                  className="!uppercase !font-semibold"
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => handleRequestSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleGroups.map((group) => {
              const isOpen = openProductId === group.productId;
              const status = statusMap[group.status] || statusMap.in_stock;

              return (
                <Fragment key={group.productId}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setOpenProductId(isOpen ? null : group.productId)
                        }
                      >
                        {isOpen ? (
                          <IoChevronDown size={18} />
                        ) : (
                          <IoChevronForward size={18} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <ProductCell
                        item={group}
                        secondary={`${group.brand || "No brand"} - ${group.modelCount} model(s)`}
                      />
                    </TableCell>
                    <TableCell align="right">{group.modelCount}</TableCell>
                    <TableCell align="right">{group.totalStock}</TableCell>
                    <TableCell align="right">
                      {formatMoney(group.totalStockValue)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} className="!p-0">
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Model</TableCell>
                                <TableCell align="right">Stock</TableCell>
                                <TableCell align="right">Avg Cost</TableCell>
                                <TableCell align="right">Sale Price</TableCell>
                                <TableCell align="right">Stock Value</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {group.models.map((model) => {
                                const modelStatus =
                                  statusMap[model.status] || statusMap.in_stock;

                                return (
                                  <TableRow key={model.modelId} hover>
                                    <TableCell>{model.modelName}</TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{ minWidth: 180 }}
                                    >
                                      <StockProgress
                                        stock={model.stockQuantity}
                                        minimum={model.minimumQuantity}
                                        expectedStock={model.expectedQuantity}
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      {formatMoney(model.costPrice)}
                                    </TableCell>
                                    <TableCell align="right">
                                      {formatMoney(model.salePrice)}
                                    </TableCell>
                                    <TableCell align="right">
                                      {formatMoney(model.stockValue)}
                                    </TableCell>
                                    <TableCell align="right">
                                      <Chip
                                        label={modelStatus.label}
                                        color={modelStatus.color}
                                        size="small"
                                        variant="outlined"
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      <Box
                                        display="flex"
                                        justifyContent="flex-end"
                                        gap={1}
                                      >
                                        <Tooltip title="Stock history">
                                          <IconButton
                                            className="!border !border-gray-200 !rounded-md"
                                            onClick={() => onOpenHistory(model)}
                                          >
                                            <HistoryIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Export products">
                                          <IconButton
                                            className="!border !border-gray-200 !rounded-md"
                                            onClick={() => onOpenExport(model)}
                                          >
                                            <OutputIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
            {visibleGroups.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedGroups.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
      />
    </Box>
  );
};

export default InventoryProductTable;
