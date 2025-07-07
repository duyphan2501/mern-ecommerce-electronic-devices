import { Button } from "@mui/material";
import {Link} from "react-router-dom"

const ViewAllButton = ({ link }) => {
  return (
    <Button component={Link} to={link} className="!text-gray-700 !capitalize !rounded-xl !py-1 hover:!text-blue-600 !font-semibold !border-2 hover:!border-blue-600">
      View All
    </Button>
  );
};

export default ViewAllButton;
