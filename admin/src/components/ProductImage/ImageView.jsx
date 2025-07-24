import { useContext } from "react";
import MyContext from "../../Context/MyContext";
import { IoClose } from "react-icons/io5";

const ImageView = ({imageSrc}) => {
  const { indexImageView, setIndexImageView } = useContext(MyContext);

  return (
    <div>
      <div className="size-screen fixed inset-0 bg-black opacity-40 z-200"></div>
      <div className="size-screen fixed inset-0 z-300 flex justify-center items-center">
        <div className="p-5 rounded-xl bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Image {indexImageView + 1}</h2>
            <button
              onClick={() => setIndexImageView(-1)}
              className="p-1 rounded-full transition bg-gray-200 border-0 hover:bg-gray-300
              cursor-pointer"
            >
              <span>
                <IoClose size={20} />
              </span>
            </button>
          </div>
          <div className="mt-3">
            <img
              src={imageSrc[indexImageView]}
              alt={`Product Image ${indexImageView + 1}`}
              className="max-w-full max-h-[500px] object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
