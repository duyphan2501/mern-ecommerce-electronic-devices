import { Link } from "react-router-dom";

const BrandCard = ({ image, logo, content, link }) => {
  return (
    <Link to={link}>
      <div className="border-1 border-gray-200 rounded-md shadow-md bg-white p-2 group">
        <div className="h-[200px]">
          <img
            src={image}
            alt=""
            className="w-full h-full object-contain rounded-md group-hover:scale-105 group-hover:rotate-1 transition"
          />
        </div>
        <div className="h-[50px]">
          <img
            src={logo}
            alt=""
            className="w-full h-full object-contain rounded-md group-hover:scale-95 transition"
          />
        </div>
        <p className="text-center font-semibold text-lg">{content}</p>
      </div>
    </Link>
  );
};

export default BrandCard;
