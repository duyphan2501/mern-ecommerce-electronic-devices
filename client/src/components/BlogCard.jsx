import { FaRegClock } from "react-icons/fa";
import {formatDate} from "../utils/DateFormat";

const BlogCard = ({ image, title, content, date }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-[220px] w-full rounded-md relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-[95%]] object-cover hover:scale-105 hover:rotate-1 transition" />
      <span className="absolute font-semibold p-1 rounded bg-secondary text-[13px] flex items-center gap-1 text-white right-4 bottom-4 z-10">
        <FaRegClock size={15} />
        {formatDate(new Date(date))}
      </span>
      </div>
      <h4 className="line-clamp-2 font-semibold text-black">{title}</h4>
      <p className="line-clamp-3">{content}</p>
    </div>
  );
};

export default BlogCard;
