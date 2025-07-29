import { Button } from "@mui/material"
import { Link } from "react-router-dom"

const CreateFooter = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end items-center gap-5">
        <Button component={Link} to={"/products/list"} className="!bg-red-400 !text-white !rounded-lg !px-6 !normal-case !font-semibold hover:!bg-black">
            Cancel
        </Button>
        <Button  className="!bg-blue-500 !text-white !rounded-lg !px-6 !normal-case !font-semibold hover:!bg-black">
            Save
        </Button>
    </div>
  )
}

export default CreateFooter