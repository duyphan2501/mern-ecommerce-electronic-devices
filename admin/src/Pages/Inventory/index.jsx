import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import OutputIcon from "@mui/icons-material/Output";
import GoodsReceiptDialog from "../../components/Inventory/GoodsReceiptDialog";
import InventoryProductTable from "../../components/Inventory/InventoryProductTable";
import InventorySummaryCards from "../../components/Inventory/InventorySummaryCards";
import MovementHistoryModal from "../../components/Inventory/MovementHistoryModal";
import StockExportDialog from "../../components/Inventory/StockExportDialog";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useInventoryStore from "../../store/inventoryStore";
import AdminPageHeader from "../../components/AdminPageHeader";
import {
  primaryActionClass,
  secondaryActionClass,
} from "../../styles/adminControls";

const Inventory = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    createGoodsReceipt,
    createStockExport,
    getInventoryData,
    getMovements,
    isLoading,
    isSaving,
    items,
    movementsByModel,
    summary,
  } = useInventoryStore();
  const [openReceipt, setOpenReceipt] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);
  const [exportItem, setExportItem] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getInventoryData(axiosPrivate);
  }, [axiosPrivate, getInventoryData]);

  const handleOpenHistory = async (item) => {
    setHistoryItem(item);
    if (!movementsByModel[item.modelId]) {
      await getMovements(item.modelId, axiosPrivate);
    }
  };

  const handleOpenExport = (item = null) => {
    setExportItem(item);
    setOpenExport(true);
  };

  return (
    <Paper sx={{ padding: "20px" }} elevation={2} className="!m-5 !rounded-xl">
      <GoodsReceiptDialog
        open={openReceipt}
        onClose={() => setOpenReceipt(false)}
        items={items}
        isSaving={isSaving}
        onSubmit={(payload) => createGoodsReceipt(payload, axiosPrivate)}
      />
      <StockExportDialog
        open={openExport}
        onClose={() => setOpenExport(false)}
        items={items}
        initialItem={exportItem}
        isSaving={isSaving}
        onSubmit={(payload) => createStockExport(payload, axiosPrivate)}
      />
      <MovementHistoryModal
        open={Boolean(historyItem)}
        onClose={() => setHistoryItem(null)}
        item={historyItem}
        movements={
          historyItem ? movementsByModel[historyItem.modelId] || [] : []
        }
      />

      <AdminPageHeader
        title="Inventory"
        description="Monitor stock levels and record incoming or outgoing goods."
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<OutputIcon />}
              onClick={() => handleOpenExport()}
              className={secondaryActionClass}
            >
              Export Products
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenReceipt(true)}
              className={primaryActionClass}
            >
              Create Goods Receipt
            </Button>
          </>
        }
      />

      <InventorySummaryCards summary={summary} />

      <Box mt={4}>
        {isLoading ? (
          <Typography>Loading inventory...</Typography>
        ) : (
          <InventoryProductTable
            items={items}
            onOpenExport={handleOpenExport}
            onOpenHistory={handleOpenHistory}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        )}
      </Box>
    </Paper>
  );
};

export default Inventory;
