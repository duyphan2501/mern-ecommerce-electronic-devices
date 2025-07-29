import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { IoFilter, IoSearch } from "react-icons/io5";
import ProductItem from "./ProductItem";
import StockProgress from "./StockProgress";
import formatMoney from "../../utils/MoneyFormat";
import { Button, Rating } from "@mui/material";
import ProductStatus from "./ProductStatus";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";

function createData(
  id,
  name,
  image,
  brand,
  stock,
  minimum,
  price,
  rating,
  status,
  expectedStock = minimum * 2
) {
  return {
    id,
    name,
    image,
    brand,
    stock,
    minimum,
    price,
    rating,
    status,
    expectedStock,
  };
}

const rows = [
  createData(
    1,
    "Inverter deye 3kw",
    "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    "Deye",
    20,
    10,
    29990000,
    4.8,
    "Active"
  ),
  createData(
    2,
    "Inverter deye 3kw",
    "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    "Deye",
    20,
    10,
    29990000,
    4.8,
    "Draft",
    30
  ),
  createData(
    3,
    "Inverter deye 3kw",
    "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    "Deye",
    2,
    10,
    29990000,
    4.8,
    "Archived",
    50
  ),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "product",
    numeric: false,
    disablePadding: true,
    label: "product",
  },
  {
    id: "stock",
    numeric: true,
    disablePadding: false,
    label: "stock",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "price",
  },
  {
    id: "rating",
    numeric: true,
    disablePadding: false,
    label: "rating",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "status",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="bg-gray-100">
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            className="!uppercase !font-semibold"
            sx={{ fontFamily: "Outfit, sans-serif" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          px: { sm: 0 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{
            flex: "1 1 100%",
            paddingLeft: 2,
            fontFamily: "Outfit, sans-serif",
          }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", fontFamily: "Outfit, sans-serif" }}
          variant="h6"
          id="tableTitle"
          component="div"
          className="!font-bold !text-xl"
        >
          Stock Report
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete" className="!mr-2">
          <IconButton>
            <MdDelete />
          </IconButton>
        </Tooltip>
      ) : (
        <div className="flex gap-2 min-w-[500px] mb-2">
          <div className="border-[1px] border-gray-300 rounded-xl h-12 w-full flex items-center px-3 overflow-hidden ">
            <IoSearch size={25} className="text-gray-400" />
            <input
              type="text"
              name=""
              id=""
              className="ms-2 outline-0 search-input w-full text-gray-500"
              placeholder="Search products"
            />
          </div>
          <div className="flex items-center">
              <Button className="!bg-white !border !border-gray-300 !rounded-xl !text-gray-500 hover:!bg-gray-200 !h-full gap-2 !normal-case !px-3">
                <IoFilter size={20}/> Filter
              </Button>
          </div>
        </div>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function StockTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <EnhancedTableToolbar numSelected={selected.length} />

      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = selected.includes(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                      onClick={(event) => handleClick(event, row.id)}
                    />
                  </TableCell>
                  <TableCell component="th" id={labelId} scope="row">
                    <ProductItem
                      name={row.name}
                      image={row.image}
                      brand={row.brand}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <StockProgress
                      stock={row.stock}
                      minimum={row.minimum}
                      expectedStock={row.expectedStock}
                    />
                  </TableCell>
                  <TableCell align="right">{formatMoney(row.price)}</TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end">
                      <Rating
                        size="small"
                        name="half-rating"
                        defaultValue={row.rating}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <ProductStatus statusLabel={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-2">
                      <Tooltip title="Edit Product" disableInteractive>
                        <IconButton className="!border !border-gray-200 !rounded-md">
                          <MdOutlineModeEdit size={20} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="View Product" disableInteractive>
                        <IconButton className="!border !border-gray-200 !rounded-md">
                          <IoEyeOutline size={20} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Product" disableInteractive>
                        <IconButton className="!border !border-gray-200 !rounded-md">
                          <MdDeleteOutline size={20} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
