import { Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import CategoryTable from "../../components/CategoryTable";
import { useCallback, useEffect, useState } from "react";
import useCategoryStore from "../../store/categoryStore";
import CategoryModal from "../../components/CategoryModal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AdminPageHeader from "../../components/AdminPageHeader";
import { primaryActionClass } from "../../styles/adminControls";

const ListCategory = () => {
  const [categories, setCategories] = useState();
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    category: null,
  });
  const { getListCategories, deleteCategory } = useCategoryStore();
  const axiosPrivate = useAxiosPrivate();

  const getCategories = useCallback(async () => {
    try {
      const cates = await getListCategories();
      setCategories(cates);
    } catch (error) {
      console.log(error);
    }
  }, [getListCategories]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

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
      <AdminPageHeader
        title="Categories"
        description="Organize the storefront catalog and category hierarchy."
        actions={
          <Button
            className={primaryActionClass}
            onClick={() =>
              setOpenModal({
                isOpen: true,
                category: null,
              })
            }
          >
            + Add Category
          </Button>
        }
      />
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
