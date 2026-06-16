import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FiArrowLeft } from "react-icons/fi";
import AdminPageHeader from "../../components/AdminPageHeader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useOrderStore from "../../store/orderStore";
import {
  compactControlSx,
  compactPrimaryActionClass,
  compactSecondaryActionClass,
  dangerActionClass,
  primaryActionClass,
  secondaryActionClass,
} from "../../styles/adminControls";
import { formatDateTime } from "../../utils/DateFormat";
import formatMoney from "../../utils/MoneyFormat";

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

const NEXT_STATUS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["packing", "cancelled"],
  packing: ["shipping"],
  shipping: ["delivered"],
};

const EMPTY_ADDRESS = {
  receiver: "",
  phone: "",
  province: "",
  ward: "",
  addressDetail: "",
};

const DetailSection = ({ children, description, title }) => (
  <Paper elevation={2} className="!rounded-xl !p-5">
    <div className="mb-4">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    {children}
  </Paper>
);

const InfoLine = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-slate-800">{value || "-"}</p>
  </div>
);

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const order = useOrderStore((s) => s.orderDetail);
  const {
    getOrderById,
    setOrderDetail,
    editOrder,
    updateOrderStatus,
    createRma,
    receiveRma,
    assessRma,
    matchRmaQuantity,
    refundRma,
    isLoading,
  } = useOrderStore();

  const [items, setItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState(EMPTY_ADDRESS);
  const [shipment, setShipment] = useState({ carrier: "", trackingCode: "" });
  const [cancelReason, setCancelReason] = useState("");
  const [rmaReason, setRmaReason] = useState("");
  const [rmaItems, setRmaItems] = useState({});
  const [rmaAssessment, setRmaAssessment] = useState({});

  const canEdit = order?.status === "pending";
  const statusOptions = NEXT_STATUS[order?.status] || [];

  useEffect(() => {
    getOrderById(axiosPrivate, id);

    return () => setOrderDetail(null);
  }, [axiosPrivate, getOrderById, id, setOrderDetail]);

  useEffect(() => {
    if (!order) return;
    setItems(
      order.items?.map((item) => ({
        modelId: item.modelId,
        quantity: item.quantity,
        name: item.name,
        image: item.image,
        price: item.price,
      })) || [],
    );
    setShippingInfo({ ...EMPTY_ADDRESS, ...(order.shippingInfo || {}) });
    setShipment({
      carrier: order.shipment?.carrier || "",
      trackingCode: order.shipment?.trackingCode || "",
    });
    setCancelReason("");
    setRmaReason("");
    setRmaItems({});
    setRmaAssessment({});
  }, [order]);

  const editedTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
    [items],
  );

  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const saveEdits = async () => {
    await editOrder(axiosPrivate, order._id, {
      items: items.map((item) => ({
        modelId: item.modelId,
        quantity: Number(item.quantity),
      })),
      shippingInfo,
    });
  };

  const changeStatus = async (status) => {
    const payload = {};
    if (status === "shipping") payload.shipment = shipment;
    if (status === "cancelled") payload.cancelReason = cancelReason;
    await updateOrderStatus(axiosPrivate, order._id, status, payload);
  };

  const createReturn = async () => {
    const selectedItems = Object.entries(rmaItems)
      .filter(([, requestedQty]) => Number(requestedQty) > 0)
      .map(([modelId, requestedQty]) => ({
        modelId,
        requestedQty: Number(requestedQty),
      }));

    if (selectedItems.length === 0) return;
    await createRma(axiosPrivate, order._id, {
      items: selectedItems,
      reason: rmaReason,
    });
  };

  const assessReturn = async (rma) => {
    const payloadItems = rma.items.map((item) => ({
      modelId: item.modelId,
      receivedQty: Number(
        rmaAssessment[rma._id]?.[item.modelId]?.receivedQty ?? item.requestedQty,
      ),
      condition:
        rmaAssessment[rma._id]?.[item.modelId]?.condition ||
        item.condition ||
        "new",
    }));

    await assessRma(axiosPrivate, order._id, rma._id, { items: payloadItems });
  };

  const setAssessment = (rmaId, modelId, field, value) => {
    setRmaAssessment((current) => ({
      ...current,
      [rmaId]: {
        ...(current[rmaId] || {}),
        [modelId]: {
          ...(current[rmaId]?.[modelId] || {}),
          [field]: value,
        },
      },
    }));
  };

  if (isLoading && !order) {
    return (
      <div className="m-5 flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="m-5">
        <AdminPageHeader
          title="Order not found"
          description="The selected order could not be loaded."
          eyebrow={
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="flex cursor-pointer items-center gap-2"
            >
              <FiArrowLeft />
              Back to orders
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="m-5 pb-10">
      <div className="mb-5">
        <AdminPageHeader
          title={`Order ${order.orderId}`}
          description={`Created at ${formatDateTime(order.createdAt)}`}
          eyebrow={
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="flex cursor-pointer items-center gap-2"
            >
              <FiArrowLeft />
              Back to orders
            </button>
          }
          actions={
            <>
              <Button
                type="button"
                variant="outlined"
                className={secondaryActionClass}
                onClick={() => navigate("/orders")}
              >
                Cancel
              </Button>
              {canEdit && (
                <Button
                  type="button"
                  variant="contained"
                  className={primaryActionClass}
                  disabled={isLoading}
                  onClick={saveEdits}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : "Save changes"}
                </Button>
              )}
            </>
          }
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.45fr)]">
        <div className="space-y-5">
          <DetailSection
            title="Customer and address"
            description="Receiver information used for fulfillment."
          >
            {!canEdit && (
              <Box className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <Typography variant="body2" className="!text-slate-600">
                  Order modification is locked after pending confirmation.
                </Typography>
              </Box>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Receiver"
                value={shippingInfo.receiver}
                disabled={!canEdit}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, receiver: e.target.value })
                }
                fullWidth
                sx={compactControlSx}
              />
              <TextField
                label="Phone"
                value={shippingInfo.phone}
                disabled={!canEdit}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
                fullWidth
                sx={compactControlSx}
              />
              <TextField
                label="Address detail"
                value={shippingInfo.addressDetail}
                disabled={!canEdit}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    addressDetail: e.target.value,
                  })
                }
                fullWidth
                className="sm:!col-span-2"
                sx={compactControlSx}
              />
              <TextField
                label="Ward"
                value={shippingInfo.ward}
                disabled={!canEdit}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, ward: e.target.value })
                }
                fullWidth
                sx={compactControlSx}
              />
              <TextField
                label="Province"
                value={shippingInfo.province}
                disabled={!canEdit}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, province: e.target.value })
                }
                fullWidth
                sx={compactControlSx}
              />
            </div>
          </DetailSection>

          <DetailSection title="Items" description="Products included in this order.">
            <TableContainer className="rounded-md border border-gray-100">
              <Table sx={{ "& .MuiTableCell-root": { py: 1.5 } }}>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Model ID</TableCell>
                    <TableCell width={120}>Qty</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={`${item.modelId}-${index}`} hover>
                      <TableCell>
                        <div className="flex min-w-[260px] items-center gap-3">
                          <div className="size-12 overflow-hidden rounded border border-gray-200">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="size-full object-cover"
                              />
                            )}
                          </div>
                          <span className="font-semibold text-slate-800">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.modelId}
                          disabled={!canEdit}
                          onChange={(e) => updateItem(index, "modelId", e.target.value)}
                          sx={{ minWidth: 180, ...compactControlSx }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.quantity}
                          disabled={!canEdit}
                          inputProps={{ min: 1 }}
                          onChange={(e) => updateItem(index, "quantity", e.target.value)}
                          sx={{ width: 96, ...compactControlSx }}
                        />
                      </TableCell>
                      <TableCell align="right">{formatMoney(item.price)}</TableCell>
                      <TableCell align="right" className="!font-semibold">
                        {formatMoney(Number(item.price || 0) * Number(item.quantity || 0))}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="error"
                          variant="outlined"
                          className={compactSecondaryActionClass}
                          disabled={!canEdit || items.length <= 1}
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="mt-4 flex justify-end">
              <div className="rounded-xl bg-slate-50 px-5 py-3 text-right">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Total
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {formatMoney(canEdit ? editedTotal : order.totalPrice)}
                </p>
              </div>
            </div>
          </DetailSection>

          {order.status === "delivered" && (
            <DetailSection
              title="Return processing"
              description="Create a return request for delivered order items."
            >
              <TextField
                label="Return reason"
                fullWidth
                value={rmaReason}
                onChange={(e) => setRmaReason(e.target.value)}
                sx={compactControlSx}
              />
              <div className="mt-4 grid gap-3">
                {order.items.map((item) => (
                  <div
                    key={item.modelId}
                    className="grid items-center gap-3 sm:grid-cols-[1fr_140px]"
                  >
                    <Typography className="!font-semibold !text-slate-800">
                      {item.name}
                    </Typography>
                    <TextField
                      type="number"
                      label="Return qty"
                      inputProps={{ min: 0, max: item.quantity }}
                      value={rmaItems[item.modelId] || ""}
                      onChange={(e) =>
                        setRmaItems({ ...rmaItems, [item.modelId]: e.target.value })
                      }
                      sx={compactControlSx}
                    />
                  </div>
                ))}
              </div>
              <Button
                className={`!mt-4 ${compactPrimaryActionClass}`}
                variant="contained"
                onClick={createReturn}
              >
                Create RMA
              </Button>
            </DetailSection>
          )}

          {order.returns?.length > 0 && (
            <DetailSection title="RMA history">
              <div className="grid gap-4">
                {order.returns.map((rma) => (
                  <div key={rma._id} className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Chip label={`RMA: ${rma.status}`} size="small" />
                      <Chip label={`Refund: ${rma.refundStatus}`} size="small" />
                    </div>
                    <Typography variant="body2" className="!text-slate-600">
                      Reason: {rma.reason || "-"}
                    </Typography>
                    <div className="mt-3 grid gap-3">
                      {rma.items.map((item) => (
                        <div key={item.modelId} className="grid gap-3 md:grid-cols-4">
                          <Typography className="!font-semibold !text-slate-800">
                            {item.name}
                          </Typography>
                          <TextField
                            type="number"
                            label="Received qty"
                            disabled={rma.status !== "received"}
                            value={
                              rmaAssessment[rma._id]?.[item.modelId]?.receivedQty ??
                              item.receivedQty ??
                              item.requestedQty
                            }
                            onChange={(e) =>
                              setAssessment(rma._id, item.modelId, "receivedQty", e.target.value)
                            }
                            sx={compactControlSx}
                          />
                          <Select
                            disabled={rma.status !== "received"}
                            value={
                              rmaAssessment[rma._id]?.[item.modelId]?.condition ||
                              item.condition ||
                              "new"
                            }
                            onChange={(e) =>
                              setAssessment(rma._id, item.modelId, "condition", e.target.value)
                            }
                            sx={compactControlSx}
                          >
                            <MenuItem value="new">New</MenuItem>
                            <MenuItem value="damaged">Damaged</MenuItem>
                          </Select>
                          <Typography className="!font-semibold">
                            {formatMoney(item.refundAmount)}
                          </Typography>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {rma.status === "requested" && (
                        <Button
                          variant="outlined"
                          className={compactSecondaryActionClass}
                          onClick={() => receiveRma(axiosPrivate, order._id, rma._id, {})}
                        >
                          Receive
                        </Button>
                      )}
                      {rma.status === "received" && (
                        <Button
                          variant="outlined"
                          className={compactSecondaryActionClass}
                          onClick={() => assessReturn(rma)}
                        >
                          Assess
                        </Button>
                      )}
                      {rma.status === "assessed" && (
                        <Button
                          variant="outlined"
                          className={compactSecondaryActionClass}
                          onClick={() => matchRmaQuantity(axiosPrivate, order._id, rma._id)}
                        >
                          Match quantity
                        </Button>
                      )}
                      {rma.status === "quantity_matched" && (
                        <Button
                          variant="contained"
                          className={compactPrimaryActionClass}
                          onClick={() => refundRma(axiosPrivate, order._id, rma._id)}
                        >
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}
        </div>

        <div className="space-y-5 xl:sticky xl:top-5 xl:self-start">
          <DetailSection title="Order summary">
            <div className="mb-4 flex flex-wrap gap-2">
              <Chip
                label={STATUS_LABELS[order.status] || order.status}
                size="small"
                color={STATUS_COLORS[order.status] || "default"}
              />
              <Chip
                label={`${order.payment?.provider || "-"} / ${order.payment?.status || "-"}`}
                size="small"
                color={order.payment?.status === "paid" ? "success" : "default"}
              />
              {order.refund?.status && order.refund.status !== "none" && (
                <Chip label={`Refund: ${order.refund.status}`} size="small" color="warning" />
              )}
            </div>
            <div className="grid gap-4">
              <InfoLine label="Customer email" value={order.email} />
              <InfoLine label="Payment provider" value={order.payment?.provider} />
              <InfoLine label="Payment status" value={order.payment?.status} />
              <InfoLine label="Refund status" value={order.refund?.status || "none"} />
              <InfoLine label="Carrier" value={order.shipment?.carrier} />
              <InfoLine label="Tracking" value={order.shipment?.trackingCode} />
            </div>
          </DetailSection>

          {(order.status === "packing" || order.status === "shipping") && (
            <DetailSection title="Shipment">
              <div className="grid gap-4">
                <TextField
                  label="Carrier"
                  value={shipment.carrier}
                  onChange={(e) =>
                    setShipment({ ...shipment, carrier: e.target.value })
                  }
                  fullWidth
                  sx={compactControlSx}
                />
                <TextField
                  label="Tracking code"
                  value={shipment.trackingCode}
                  onChange={(e) =>
                    setShipment({ ...shipment, trackingCode: e.target.value })
                  }
                  fullWidth
                  sx={compactControlSx}
                />
              </div>
            </DetailSection>
          )}

          {statusOptions.length > 0 && (
            <DetailSection title="Status actions">
              <div className="grid gap-3">
                {statusOptions.map((status) => (
                  <div key={status} className="grid gap-2">
                    {status === "cancelled" && (
                      <TextField
                        label="Cancel reason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        fullWidth
                        sx={compactControlSx}
                      />
                    )}
                    <Button
                      variant={status === "cancelled" ? "outlined" : "contained"}
                      color={status === "cancelled" ? "error" : "primary"}
                      className={
                        status === "cancelled"
                          ? dangerActionClass
                          : compactPrimaryActionClass
                      }
                      disabled={isLoading}
                      onClick={() => changeStatus(status)}
                    >
                      {STATUS_LABELS[status] || status}
                    </Button>
                  </div>
                ))}
              </div>
            </DetailSection>
          )}
        </div>
      </div>
    </div>
  );
}
