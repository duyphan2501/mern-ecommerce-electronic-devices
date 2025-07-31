import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";

const DocumentUpload = ({
  field,
  modelIndex = 0,
  handleChangeValue,
  productDocuments,
}) => {
  const [documents, setDocuments] = useState(productDocuments || []);
  const [dragActive, setDragActive] = useState(false);
  const inputId = `doc-upload-${modelIndex}`;

  useEffect(() => {
    setDocuments(productDocuments || []);
  }, [productDocuments]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
    e.target.value = ""; // reset input
  };

  const updateProductDocuments = (docs) => {
    setDocuments(docs);
    handleChangeValue(field, modelIndex, docs);
  };

  const addFiles = (newFiles) => {
    const uniqueFiles = [...documents, ...newFiles].filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size)
    );
    updateProductDocuments(uniqueFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    updateProductDocuments(updatedDocs);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  return (
    <div>
      {/* Danh sách file */}
      <div className="space-y-2">
        {documents.length === 0 ? (
          <p className="text-gray-500 text-sm">No file selected</p>
        ) : (
          documents.map((file, index) => {
            const fileUrl = URL.createObjectURL(file);
            return (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded text-sm"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={fileUrl}
                  className="truncate line-clamp-1 hover:underline"
                >
                  📄 {file.name}
                </a>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleRemoveFile(index)}
                >
                  <RiDeleteBinLine size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Khu vực kéo thả + input */}
      <div
        className={`mt-3 border-2 rounded-lg ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } cursor-pointer transition-all`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label
          htmlFor={inputId}
          className="flex justify-center items-center gap-2 cursor-pointer h-17 w-full"
        >
          <IoCloudUploadOutline size={24} />
          <span className="">Drop or select file here</span>
        </label>
        <input
          type="file"
          className="hidden w-full"
          id={inputId}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx"
        />
      </div>
    </div>
  );
};

export default DocumentUpload;
