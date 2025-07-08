const status = [
  { label: "Draft", color: "#000000" },
  { label: "Active", color: "#22c55e" },
  { label: "Archived", color: "#9ca3af" },
];

const ProductStatus = ({ statusLabel }) => {
  const getStatus = () => {
    return (
      status.find(
        (stat) => stat.label.toLowerCase() === statusLabel.toLowerCase()
      ) || { label: statusLabel, color: "#6b7280" } // fallback: gray-500
    );
  };

  const statusObj = getStatus();

  return (
    <div className="flex items-center gap-2 justify-end">
      <div
        className="size-2 rounded-full"
        style={{ backgroundColor: statusObj.color }}
      />
      <p className="text-sm font-medium" style={{ color: statusObj.color }}>
        {statusObj.label}
      </p>
    </div>
  );
};

export default ProductStatus;
