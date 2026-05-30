import { Box } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { DashboardCardProduct } from "../../../components/DashboardCard";
import formatMoney from "../../../utils/MoneyFormat";

const InventorySummaryCards = ({ summary }) => {
  return (
    <Box className="mt-5 grid md:grid-cols-4 gap-3">
      <DashboardCardProduct
        BackgroundColor="#1A2C4E"
        icon={Inventory2OutlinedIcon}
        CardHeader="Stock Value"
        CardDesc={formatMoney(summary.totalStockValue || 0)}
      />
      <DashboardCardProduct
        BackgroundColor="#F7B600"
        icon={ReportProblemOutlinedIcon}
        CardHeader="Low Stock"
        CardDesc={`${summary.lowStockCount || 0} models`}
      />
      <DashboardCardProduct
        BackgroundColor="#B01D2A"
        icon={RemoveCircleOutlineIcon}
        CardHeader="Out of Stock"
        CardDesc={`${summary.outOfStockCount || 0} models`}
      />
      <DashboardCardProduct
        BackgroundColor="#689801"
        icon={TrendingUpOutlinedIcon}
        CardHeader="Estimated Profit"
        CardDesc={formatMoney(summary.estimatedProfit || 0)}
      />
    </Box>
  );
};

export default InventorySummaryCards;
