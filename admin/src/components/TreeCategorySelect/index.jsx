import { useMemo } from "react";
import { TreeSelect } from "antd";

const buildTree = (data, parentId = null) => {
  return data
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      value: item._id, // Cho Select
      label: item.name, // Cho Select
      children: buildTree(data, item._id),
    }));
};
const findAncestors = (currentId, allCategories, ancestors = []) => {
  const current = allCategories.find((cat) => cat._id === currentId);
  if (current && current.parentId) {
    const parent = allCategories.find((cat) => cat._id === current.parentId);
    if (parent) {
      ancestors.push(parent._id);
      return findAncestors(parent._id, allCategories, ancestors);
    }
  }
  return ancestors;
};

const TreeCategorySelect = ({ allCategories, selectedIds, onChange }) => {
  // 1. Tạo cấu trúc cây để hiển thị
  const treeData = useMemo(
    () => buildTree(allCategories, null),
    [allCategories],
  );

  const handleSelect = (selectedValues) => {
    // 1. Nếu người dùng xóa hết (Clear)
    if (!selectedValues || selectedValues.length === 0) {
      onChange([]);
      return;
    }

    // 2. Với mỗi ID được chọn, tìm thêm các cha của nó
    let allRelatedIds = [...selectedValues];

    selectedValues.forEach((id) => {
      const ancestors = findAncestors(id, allCategories);
      allRelatedIds = [...allRelatedIds, ...ancestors];
    });

    // 3. Loại bỏ trùng lặp và gửi lên parent
    const finalSelection = Array.from(new Set(allRelatedIds));
    onChange(finalSelection);
  };

  return (
    <TreeSelect
      showSearch
      style={{ width: "100%" }}
      value={selectedIds} // Mảng các ID đã chọn
      placeholder="Select categories"
      styles={{
        popup: {
          root: { maxHeight: 400, overflow: "auto" },
        },
      }}
      allowClear
      multiple
      treeData={treeData}
      onChange={handleSelect}
      className="!p-2 !rounded-xl bg-gray-300"
    />  
  );
};

export default TreeCategorySelect;
