import { Button, IconButton } from "@mui/material";
import { FaXmark } from "react-icons/fa6";
import TextInput from "../BasicInfoProduct/TextInput";
import { useEffect, useState } from "react";
import useCategoryStore from "../../store/categoryStore";
import AttributeSelect from "../Attribute/AttributeSelect";
import UploadImage from "./UploadImage";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useContext } from "react";
import MyContext from "../../Context/MyContext";

const CategoryModal = ({ dataModal, closeModal, getCategories }) => {
  const [category, setCategory] = useState({
    _id: dataModal?._id || null,
    name: dataModal?.name ||  "",
    parentId: dataModal?.parentId || null,
    image: dataModal?.image || null,
  })

  const [categories, setCategories] = useState();
  const { getAllCategories, createCategory, updateCategory, isLoading } = useCategoryStore();
  const axiosPrivate = useAxiosPrivate();
  const { fiLoader } = useContext(MyContext);

  const fetchAllCategories = async () => {
    try {
      const cates = await getAllCategories();
      setCategories(cates);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleChange = (val, field) => {
    setCategory((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveCategory = async () => {
    try {
      if (dataModal) await updateCategory(axiosPrivate, category)
      else await createCategory(axiosPrivate, category);
      await getCategories()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="fixed inset-0 bg-black/20 z-100 flex justify-center items-center"
        onClick={closeModal}
      >
        <div className="z-200" onClick={e => e.stopPropagation()}>
          <div className="p-5 rounded-xl bg-white w-[600px]">
            {/*  */}
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-lg">
                {dataModal ? "Edit Category" : "Create Category"}
              </h5>
              <IconButton onClick={closeModal} className="">
                <FaXmark size={20} />
              </IconButton>
            </div>
            {/* form  */}
            <div className="mt-3 space-y-5">
              <div className="">
                <p className="mb-1 font-medium">Category Name</p>
                <TextInput
                  placeholder="category name"
                  value={category.name}
                  onChange={(val) => handleChange(val, "name")}
                />
              </div>
              <div className="">
                <p className="mb-1 font-medium">Parent Category</p>
                {categories && (
                  <AttributeSelect
                    selectItems={categories}
                    onChange={(val) => handleChange(val, "parentId")}
                    selectedItemId={category.parentId}
                  />
                )}
              </div>
              <div className="">
                <p className="mb-1 font-medium">Category Image</p>
                <UploadImage
                  onChangeImage={(val) => handleChange(val, "image")}
                  image={category.image}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  className="!normal-case !bg-blue-500 !text-white hover:!bg-black"
                  onClick={handleSaveCategory}
                >
                  {isLoading && fiLoader}{" "}
                  {dataModal ? "Save Category" : "Create Category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
