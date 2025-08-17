import { Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import CategoryTable from "../../components/CategoryTable";
import { useEffect, useState } from "react";
import useCategoryStore from "../../store/categoryStore";
import CategoryModal from "../../components/CategoryModal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ListCategory = () => {
  const [categories, setCategories] = useState();
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    category: null,
  });
  const { getListCategories, deleteCategory } = useCategoryStore();
  const axiosPrivate = useAxiosPrivate();

  const getCategories = async () => {
    try {
      const cates = await getListCategories();
      setCategories(cates);
      console.log(cates);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(axiosPrivate, categoryId);
      await getCategories();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper sx={{ padding: "20px" }} elevation={2} className="!m-5 !rounded-xl">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl">Categories</h3>
        <Button
          className="!h-12 !bg-blue-500 !rounded-xl !px-6 !normal-case !text-white !font-semibold hover:!bg-black"
          onClick={() =>
            setOpenModal({
              isOpen: true,
              category: null,
            })
          }
        >
          + Add Category
        </Button>
      </div>
      <div className="mt-2">
        <CategoryTable
          data={categories}
          onDelete={(id) => handleDeleteCategory(id)}
          openModal={setOpenModal}
        />
      </div>
      {openModal.isOpen && (
        <CategoryModal
          closeModal={() => setOpenModal(prev => ({ ...prev, isOpen: false }))}
          getCategories={getCategories}
          dataModal={openModal.category}
        />
      )}
    </Paper>
  );
};

export default ListCategory;
