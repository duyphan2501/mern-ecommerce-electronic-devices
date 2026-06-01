import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import formatMoney from "../../utils/MoneyFormat";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useOrderStore from "../../store/orderStore";
import { formatDateTime } from "../../utils/DateFormat";

const STATUS_LABELS = {
  pending: "Pending Confirmation",
  confirmed: "Confirmed",
  packing: "Packing",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
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

export default function OrderDetailModal({ open, order, onClose }) {
  const axiosPrivate = useAxiosPrivate();
  const {
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

  if (!order) return null;

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box className="flex flex-wrap items-center gap-2">
          <Typography variant="h6" className="!font-bold">
            {order.orderId}
          </Typography>
          <Chip label={STATUS_LABELS[order.status] || order.status} size="small" />
          <Chip
            label={`${order.payment?.provider || ""} / ${order.payment?.status || ""}`}
            size="small"
            color={order.payment?.status === "paid" ? "success" : "default"}
          />
          {order.refund?.status && order.refund.status !== "none" && (
            <Chip label={`Refund: ${order.refund.status}`} size="small" color="warning" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Created at {formatDateTime(order.createdAt)}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {!canEdit && (
          <Box className="mb-4 rounded border border-gray-200 bg-gray-50 p-3">
            <Typography variant="body2">
              Order modification is locked after pending confirmation.
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" className="!font-bold">
              Customer and address
            </Typography>
            <Box className="mt-3 grid gap-3">
              <TextField
                label="Receiver"
                size="small"
                value={shippingInfo.receiver}
                disabled={!canEdit}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, receiver: e.target.value })
                }
              />
              <TextField
                label="Phone"
                size="small"
                value={shippingInfo.phone}
                disabled={!canEdit}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
              />
              <TextField
                label="Address detail"
                size="small"
                value={shippingInfo.addressDetail}
                disabled={!canEdit}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    addressDetail: e.target.value,
                  })
                }
              />
              <Box className="grid grid-cols-2 gap-3">
                <TextField
                  label="Ward"
                  size="small"
                  value={shippingInfo.ward}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, ward: e.target.value })
                  }
                />
                <TextField
                  label="Province"
                  size="small"
                  value={shippingInfo.province}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setShippingInfo({ ...shippingInfo, province: e.target.value })
                  }
                />
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" className="!font-bold">
              Payment and shipment
            </Typography>
            <Box className="mt-3 grid gap-2 text-sm">
              <p>Email: {order.email}</p>
              <p>Payment provider: {order.payment?.provider}</p>
              <p>Payment status: {order.payment?.status}</p>
              <p>Refund status: {order.refund?.status || "none"}</p>
            </Box>
            {(order.status === "packing" || order.status === "shipping") && (
              <Box className="mt-4 grid grid-cols-2 gap-3">
                <TextField
                  label="Carrier"
                  size="small"
                  value={shipment.carrier}
                  onChange={(e) =>
                    setShipment({ ...shipment, carrier: e.target.value })
                  }
                />
                <TextField
                  label="Tracking code"
                  size="small"
                  value={shipment.trackingCode}
                  onChange={(e) =>
                    setShipment({ ...shipment, trackingCode: e.target.value })
                  }
                />
              </Box>
            )}
            {order.shipment?.trackingCode && (
              <Box className="mt-3 text-sm">
                <p>Carrier: {order.shipment.carrier || "-"}</p>
                <p>Tracking: {order.shipment.trackingCode}</p>
              </Box>
            )}
          </Grid>
        </Grid>

        <Divider className="!my-5" />

        <Typography variant="subtitle1" className="!font-bold">
          Items
        </Typography>
        <Box className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Model ID</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Subtotal</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.modelId}-${index}`} className="border-b">
                  <td className="p-2">
                    <img src={item.image} alt={item.name} className="size-12 rounded object-cover" />
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">
                    <TextField
                      size="small"
                      value={item.modelId}
                      disabled={!canEdit}
                      onChange={(e) => updateItem(index, "modelId", e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      disabled={!canEdit}
                      inputProps={{ min: 1 }}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                    />
                  </td>
                  <td className="p-2">{formatMoney(item.price)}</td>
                  <td className="p-2">
                    {formatMoney(Number(item.price || 0) * Number(item.quantity || 0))}
                  </td>
                  <td className="p-2">
                    <Button
                      color="error"
                      disabled={!canEdit || items.length <= 1}
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Box className="mt-3 flex justify-end font-bold">
          Total: {formatMoney(canEdit ? editedTotal : order.totalPrice)}
        </Box>

        {order.status === "delivered" && (
          <>
            <Divider className="!my-5" />
            <Typography variant="subtitle1" className="!font-bold">
              Return processing
            </Typography>
            <Box className="mt-3 rounded border border-gray-200 p-3">
              <TextField
                label="Return reason"
                size="small"
                fullWidth
                value={rmaReason}
                onChange={(e) => setRmaReason(e.target.value)}
              />
              <Box className="mt-3 grid gap-2">
                {order.items.map((item) => (
                  <Box key={item.modelId} className="grid grid-cols-[1fr_120px] gap-3">
                    <Typography>{item.name}</Typography>
                    <TextField
                      type="number"
                      size="small"
                      label="Return qty"
                      inputProps={{ min: 0, max: item.quantity }}
                      value={rmaItems[item.modelId] || ""}
                      onChange={(e) =>
                        setRmaItems({ ...rmaItems, [item.modelId]: e.target.value })
                      }
                    />
                  </Box>
                ))}
              </Box>
              <Button className="!mt-3" variant="contained" onClick={createReturn}>
                Create RMA
              </Button>
            </Box>
          </>
        )}

        {order.returns?.length > 0 && (
          <Box className="mt-4 grid gap-3">
            {order.returns.map((rma) => (
              <Box key={rma._id} className="rounded border border-gray-200 p-3">
                <Box className="mb-2 flex flex-wrap items-center gap-2">
                  <Chip label={`RMA: ${rma.status}`} size="small" />
                  <Chip label={`Refund: ${rma.refundStatus}`} size="small" />
                </Box>
                <Typography variant="body2">Reason: {rma.reason || "-"}</Typography>
                <Box className="mt-2 grid gap-2">
                  {rma.items.map((item) => (
                    <Box key={item.modelId} className="grid gap-2 md:grid-cols-4">
                      <Typography>{item.name}</Typography>
                      <TextField
                        type="number"
                        size="small"
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
                      />
                      <Select
                        size="small"
                        disabled={rma.status !== "received"}
                        value={
                          rmaAssessment[rma._id]?.[item.modelId]?.condition ||
                          item.condition ||
                          "new"
                        }
                        onChange={(e) =>
                          setAssessment(rma._id, item.modelId, "condition", e.target.value)
                        }
                      >
                        <MenuItem value="new">New</MenuItem>
                        <MenuItem value="damaged">Damaged</MenuItem>
                      </Select>
                      <Typography>{formatMoney(item.refundAmount)}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box className="mt-3 flex flex-wrap gap-2">
                  {rma.status === "requested" && (
                    <Button variant="outlined" onClick={() => receiveRma(axiosPrivate, order._id, rma._id, {})}>
                      Receive
                    </Button>
                  )}
                  {rma.status === "received" && (
                    <Button variant="outlined" onClick={() => assessReturn(rma)}>
                      Assess
                    </Button>
                  )}
                  {rma.status === "assessed" && (
                    <Button variant="outlined" onClick={() => matchRmaQuantity(axiosPrivate, order._id, rma._id)}>
                      Match quantity
                    </Button>
                  )}
                  {rma.status === "quantity_matched" && (
                    <Button variant="contained" onClick={() => refundRma(axiosPrivate, order._id, rma._id)}>
                      Refund
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions className="!flex !flex-wrap !justify-between">
        <Box className="flex flex-wrap gap-2">
          {canEdit && (
            <Button variant="contained" disabled={isLoading} onClick={saveEdits}>
              Save edits
            </Button>
          )}
          {statusOptions.map((status) => (
            <Box key={status} className="flex items-center gap-2">
              {status === "cancelled" && (
                <TextField
                  size="small"
                  label="Cancel reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              )}
              <Button
                variant={status === "cancelled" ? "outlined" : "contained"}
                color={status === "cancelled" ? "error" : "primary"}
                disabled={isLoading}
                onClick={() => changeStatus(status)}
              >
                {STATUS_LABELS[status] || status}
              </Button>
            </Box>
          ))}
        </Box>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
