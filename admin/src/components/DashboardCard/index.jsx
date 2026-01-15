import { Card, CardContent, Box, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

function DashboardCard({
  BackgroundColor = "blue",
  icon: Icon = ShoppingCartOutlinedIcon,
  CardHeader = "132 Likes",
  CardDesc = "21 today",
}) {
  return (
    <>
      <Card
        sx={{
          background: "white",
          width: "100%",
          padding: "16px",
          display: "flex",
          borderRadius: "12px",
        }}
      >
        <div
          className="p-3 flex items-start justify-center rounded-md mr-2"
          style={{ backgroundColor: BackgroundColor }}
        >
          <Icon style={{ width: 20, height: 20, fill: "white" }} />
        </div>

        <Box
          sx={{
            maxHeight: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontWeight={500} mb={0}>
            {CardHeader}
          </Typography>
          <Typography>{CardDesc}</Typography>
        </Box>
      </Card>
    </>
  );
}

function DashboardCardProduct({
  BackgroundColor = "blue",
  icon: Icon = ShoppingCartOutlinedIcon,
  CardHeader = "132 Likes",
  CardDesc = "21 today",
}) {
  return (
    <>
      <Card
        sx={{
          background: "white",
          width: "100%",
          padding: "16px",
          display: "flex",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            maxHeight: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={"100%"} fontWeight={500} mb={0}>
            {CardHeader}
          </Typography>
          <Typography fontSize={"80%"}>{CardDesc}</Typography>
        </Box>

        <Box flexGrow={1} />

        <div
          className="p-3 flex items-start justify-center rounded-md mr-2"
          style={{ backgroundColor: BackgroundColor }}
        >
          <Icon style={{ width: 20, height: 20, fill: "white" }} />
        </div>
      </Card>
    </>
  );
}

export { DashboardCard, DashboardCardProduct };
