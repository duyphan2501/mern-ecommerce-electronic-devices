import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import ConfirmDialog from "../ConfirmDialog";
import formatMoney from "../../utils/MoneyFormat";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProductStore from "../../store/productStore";
import ProductStatus from "../StockTable/ProductStatus";
import {
  compactControlSx,
  dangerIconActionClass,
  iconActionClass,
} from "../../styles/adminControls";

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || "";

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getBrandName = (product) => product.brandId?.name || "No brand";

const getCategorySummary = (product) => {
  const categories = product.categoryIds || [];
  if (!categories.length) return "No category";
  return categories.map((category) => category.name).join(", ");
};

const getPriceRange = (models = []) => {
  const prices = models
    .map((model) => Number(model.salePrice || 0))
    .filter((price) => price >= 0);

  if (!prices.length) return formatMoney(0);

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatMoney(min) : `${formatMoney(min)} - ${formatMoney(max)}`;
};

const getProductImage = (product) =>
  product.modelsId?.find((model) => model.images?.length)?.images?.[0] ||
  "/vite.svg";

const getPreviewUrl = (slug) => {
  if (!slug) return "#";
  return `${CLIENT_URL}/product/${slug}`;
};

const ProductTable = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    archiveProduct,
    fetchAdminProducts,
    isListLoading,
    products,
    totalProducts,
  } = useProductStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openProductId, setOpenProductId] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      term: debouncedSearch,
      status: statusFilter,
    }),
    [debouncedSearch, page, rowsPerPage, statusFilter],
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchValue), 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    fetchAdminProducts(params, axiosPrivate);
  }, [axiosPrivate, fetchAdminProducts, params]);

  const handleArchive = async () => {
    if (!archiveTarget) return;
    const success = await archiveProduct(archiveTarget._id, axiosPrivate);
    if (success) {
      setArchiveTarget(null);
      fetchAdminProducts(params, axiosPrivate);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Toolbar sx={{ px: 0, mb: 1, gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h6" sx={{ flex: "1 1 180px", fontWeight: 700 }}>
          Product Catalog
        </Typography>

        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 150, ...compactControlSx }}
        >
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </TextField>

        <TextField
          size="small"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            setPage(0);
          }}
          placeholder="Search product, model, brand"
          sx={{ minWidth: 320, ...compactControlSx }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Toolbar>

      <TableContainer className="rounded-md">
        <Table sx={{ minWidth: 1050 }}>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell width={44} />
              <TableCell className="!uppercase !font-semibold">Product</TableCell>
              <TableCell className="!uppercase !font-semibold">Categories</TableCell>
              <TableCell align="right" className="!uppercase !font-semibold">
                Models
              </TableCell>
              <TableCell align="right" className="!uppercase !font-semibold">
                Price
              </TableCell>
              <TableCell align="right" className="!uppercase !font-semibold">
                Status
              </TableCell>
              <TableCell align="right" className="!uppercase !font-semibold">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const models = product.modelsId || [];
              const isOpen = openProductId === product._id;
              const previewUrl = getPreviewUrl(product.productUrl);

              return (
                <Fragment key={product._id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setOpenProductId(isOpen ? null : product._id)
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
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <img
                          src={getProductImage(product)}
                          alt={product.productName}
                          className="size-12 rounded-md object-cover border border-gray-200"
                        />
                        <Box minWidth={0}>
                          <Typography fontWeight={700} noWrap>
                            {product.productName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {getBrandName(product)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      <Typography variant="body2" noWrap>
                        {getCategorySummary(product)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{models.length}</TableCell>
                    <TableCell align="right">{getPriceRange(models)}</TableCell>
                    <TableCell align="right">
                      <ProductStatus statusLabel={product.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Tooltip title="Edit product">
                          <IconButton
                            component={Link}
                            to={`/products/edit/${product._id}`}
                            className={iconActionClass}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Preview storefront">
                          <IconButton
                            component="a"
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={iconActionClass}
                            disabled={!product.productUrl}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Archive product">
                          <IconButton
                            className={dangerIconActionClass}
                            onClick={() => setArchiveTarget(product)}
                            disabled={product.status === "archived"}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} className="!p-0">
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Model</TableCell>
                                <TableCell align="right">Sale Price</TableCell>
                                <TableCell align="right">Discount</TableCell>
                                <TableCell align="right">Tax</TableCell>
                                <TableCell align="right">Documents</TableCell>
                                <TableCell>Specifications</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {models.map((model) => (
                                <TableRow key={model._id} hover>
                                  <TableCell>{model.modelName || "Default"}</TableCell>
                                  <TableCell align="right">
                                    {formatMoney(model.salePrice || 0)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {Number(model.discount || 0)}%
                                  </TableCell>
                                  <TableCell align="right">
                                    {Number(model.tax || 0)}%
                                  </TableCell>
                                  <TableCell align="right">
                                    {model.documents?.length || 0}
                                  </TableCell>
                                  <TableCell sx={{ maxWidth: 360 }}>
                                    <Typography variant="body2" noWrap>
                                      {stripHtml(model.specifications) || "No specifications"}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {models.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={6} align="center">
                                    No models
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}

            {!isListLoading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  No products found
                </TableCell>
              </TableRow>
            )}

            {isListLoading && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  Loading products...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalProducts}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
      />

      <ConfirmDialog
        open={Boolean(archiveTarget)}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        content={`Archive "${archiveTarget?.productName || ""}"? It will stay in the database but be hidden from active catalog results.`}
        action="Archive"
      />
    </Box>
  );
};

export default ProductTable;
