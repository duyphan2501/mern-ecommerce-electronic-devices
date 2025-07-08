import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const StockProgress = ({ stock, minimum, expectedStock }) => {
  const target = expectedStock || minimum * 2;
  const rate = Math.min((stock / target) * 100, 100);

  const getBarColor = () => {
    if (stock < minimum) return "#ef4444"; 
    if (stock < minimum * 2) return "#facc15"; 
    return "#22c55e"; 
  };

  const getLabel = () => {
    if (stock < minimum) return "very low in stock";
    if (stock < minimum * 2) return "low in stock";
    return "in stock";
  };

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 7,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[300],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: getBarColor(),
    },
  }));

  return (
    <div className="">
      <BorderLinearProgress variant="determinate" value={rate} className="mb-1"/><p >{stock} {getLabel()}</p>
    </div>
  );
};

export default StockProgress;
