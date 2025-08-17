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
import { MdDelete, MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import {
  IoFilter,
  IoSearch,
  IoChevronForward,
  IoChevronDown,
} from "react-icons/io5";
import { Button } from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (b?.[orderBy] < a?.[orderBy]) return -1;
  if (b?.[orderBy] > a?.[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: "name", numeric: false, disablePadding: false, label: "Category Name" },
  { id: "image", numeric: false, disablePadding: false, label: "image" },
  { id: "action", numeric: true, disablePadding: false, label: "Action" },
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
  const createSortHandler = (property) => (event) =>
    onRequestSort(event, property);

  return (
    <TableHead className="bg-gray-100">
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
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
              // Chỉ bật sort thực sự cho cột name để giữ cấu trúc cây ổn định
              active={headCell.id === "name" && orderBy === "name"}
              direction={order}
              onClick={
                headCell.id === "name" ? createSortHandler("name") : undefined
              }
            >
              {headCell.label}
              {orderBy === "name" && headCell.id === "name" ? (
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
function EnhancedTableToolbar(props) {
  const { numSelected, searchValue, onSearchChange, deleteSelected } = props;
  return (
    <Toolbar
      sx={[
        { px: { sm: 0 } },
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
          sx={{ flex: "1 1 100%", pl: 2, fontFamily: "Outfit, sans-serif" }}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", fontFamily: "Outfit, sans-serif" }}
          variant="h6"
          className="!font-bold !text-xl"
        >
          Categories Table
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete" className="!mr-2">
          <IconButton onClick={deleteSelected}>
            <MdDelete />
          </IconButton>
        </Tooltip>
      ) : (
        <div className="flex gap-2 min-w-[500px] mb-2">
          <div className="border-[1px] border-gray-300 rounded-xl h-10 w-full flex items-center px-3 overflow-hidden">
            <IoSearch size={25} className="text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="ms-2 outline-0 w-full text-gray-500"
              placeholder="Search category by name"
            />
          </div>
        </div>
      )}
    </Toolbar>
  );
}
export default function CategoryTable({ data, onDelete, openModal }) {
  if (!data) return null;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name"); // chỉ dùng 'name' cho sort cây
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [expandedIds, setExpandedIds] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    for (let id of selected) {
      await onDelete(id);
    }
  };

  // Lọc theo từ khoá: giữ node nếu nó khớp hoặc con của nó khớp
  const filteredData = React.useMemo(() => {
    if (!searchValue) return data;
    const q = searchValue.toLowerCase();
    const filterTree = (nodes) =>
      nodes
        .map((node) => ({
          ...node,
          children: filterTree(node.children || []),
        }))
        .filter(
          (node) =>
            node.name?.toLowerCase().includes(q) ||
            (node.children && node.children.length > 0)
        );
    return filterTree(data);
  }, [data, searchValue]);

  // Sort theo cây: chỉ sort các siblings theo 'name' để không phá cấu trúc
  const treeComparator = React.useMemo(
    () => getComparator(order, "name"),
    [order]
  );

  const flattenCategories = React.useCallback(
    (categories, level = 0, parentExpanded = true) => {
      const siblings = [...categories].sort(treeComparator);

      return siblings.flatMap((cat) => {
        const isExpanded = expandedIds.includes(cat._id);
        const visible = parentExpanded;
        const hasChildren =
          Array.isArray(cat.children) && cat.children.length > 0;

        if (!visible) return [];

        return [
          {
            ...cat,
            level,
            isExpanded,
            hasChildren,
          },
          // chỉ flatten children khi đang expanded
          ...(hasChildren && isExpanded
            ? flattenCategories(cat.children, level + 1, isExpanded)
            : []),
        ];
      });
    },
    [expandedIds, treeComparator]
  );

  const rows = React.useMemo(
    () => flattenCategories(filteredData),
    [filteredData, flattenCategories]
  );

  const handleRequestSort = (_e, property) => {
    // giữ cấu trúc: chỉ cho sort theo name
    if (property !== "name") return;
    const isAsc = orderBy === "name" && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy("name");
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(rows.map((n) => n._id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // KHÔNG sort lại rows phẳng lần nữa để tránh phá cây
  const visibleRows = React.useMemo(
    () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <EnhancedTableToolbar
        numSelected={selected.length}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        deleteSelected={handleDeleteSelected}
      />
      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                hover
                key={row._id}
                selected={selected.includes(row._id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(row._id)}
                    onClick={(e) => {
                      handleClick(row._id);
                    }}
                  />
                </TableCell>

                {/* NAME + TOGGLER */}
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {row.hasChildren ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          toggleExpand(row._id);
                        }}
                      >
                        {row.isExpanded ? (
                          <IoChevronDown size={18} />
                        ) : (
                          <IoChevronForward size={18} />
                        )}
                      </IconButton>
                    ) : (
                      <div style={{ width: 32 }} />
                    )}
                    <span
                      style={{
                        paddingLeft: row.level * 20,
                        fontWeight: row.level === 0 ? "bold" : "normal",
                      }}
                    >
                      {row.name}
                    </span>
                  </div>
                </TableCell>

                {/* IMAGE */}
                <TableCell>
                  {row.image ? (
                    <img
                      src={row.image}
                      alt={row.name}
                      className="size-12 rounded-xl"
                    />
                  ) : (
                    <div className="size-12 rounded-xl bg-gray-100" />
                  )}
                </TableCell>

                {/* ACTIONS */}
                <TableCell align="right">
                  <Tooltip title="Edit Category">
                    <IconButton
                      onClick={() => openModal({ isOpen: true, category: row })}
                    >
                      <MdOutlineModeEdit size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Category">
                    <IconButton onClick={() => onDelete(row._id)}>
                      <MdDeleteOutline size={20} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
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
