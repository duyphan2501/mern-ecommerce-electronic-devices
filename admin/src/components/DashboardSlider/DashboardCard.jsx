import {
  MdKeyboardDoubleArrowUp,
  MdKeyboardDoubleArrowDown,
} from "react-icons/md";

const DashboardCard = ({
  icon,
  label,
  number = -1,
  price = -1,
  chartIcon,
  gapLastmonth,
}) => {
  const getProp = () => {
    return gapLastmonth < 0
      ? {
          color: "text-red-600",
          icon: <MdKeyboardDoubleArrowDown />,
          label: "Decreased last month",
        }
      : {
          color: "text-green-600",
          icon: <MdKeyboardDoubleArrowUp />,
          label: "Increased last month",
        };
  }
  return (
    <div className="rounded-md border border-gray-200 p-5 shadow bg-white">
      <div className="flex justify-between items-center pb-4 border-dashed border-b border-gray-300">
        <div className="flex items-center gap-2">
          {icon}
          <div className="flex flex-col">
            <p className=" font-light">{label}</p>
            <p className="font-bold text-lg text-black">
              {number != -1
                ? number.toLocaleString()
                : price.toLocaleString() + " VNĐ"}
            </p>
          </div>
        </div>
        <div className="">{chartIcon}</div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <span className={`${getProp().color} flex items-center`}>
          {getProp().icon} {gapLastmonth}%
        </span>
        <p className="text-gray-500 font-light">{getProp().label}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
