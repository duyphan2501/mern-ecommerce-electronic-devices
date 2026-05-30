import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";

const DocumentUpload = ({
  field,
  modelIndex = 0,
  handleChangeValue,
  productDocuments,
}) => {
  const [documents, setDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputId = `doc-upload-${modelIndex}`;

  useEffect(() => {
    setDocuments(productDocuments || []);
  }, [productDocuments]);

  const isSameDocument = (left, right) => {
    if (left instanceof File && right instanceof File) {
      return left.name === right.name && left.size === right.size;
    }
    if (typeof left === "string" && typeof right === "string") {
      return left === right;
    }
    if (left?.url && right?.url) {
      return left.url === right.url;
    }
    return false;
  };

  const updateProductDocuments = (docs) => {
    setDocuments(docs);
    handleChangeValue(field, modelIndex, docs);
  };

  const addFiles = (newFiles) => {
    const uniqueFiles = [...documents, ...newFiles].filter(
      (file, index, self) =>
        index === self.findIndex((item) => isSameDocument(item, file)),
    );
    updateProductDocuments(uniqueFiles);
  };

  const handleRemoveFile = (index) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    updateProductDocuments(updatedDocs);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    addFiles(files);
    event.target.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files);
    addFiles(files);
  };

  const getDocumentUrl = (file) => {
    if (file instanceof File) return URL.createObjectURL(file);
    if (typeof file === "string") return file;
    return file?.url || "";
  };

  const getDocumentName = (file) => {
    if (file instanceof File) return file.name;
    if (typeof file === "string") return file.split("/").pop();
    return file?.name || file?.url?.split("/").pop() || "Unknown file";
  };

  return (
    <div>
      <div className="space-y-2">
        {documents.length === 0 ? (
          <p className="text-gray-500 text-sm">No file selected</p>
        ) : (
          documents.map((file, index) => (
            <div
              key={`${getDocumentName(file)}-${index}`}
              className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded text-sm"
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={getDocumentUrl(file)}
                className="truncate line-clamp-1 hover:underline"
              >
                {getDocumentName(file)}
              </a>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 cursor-pointer"
                onClick={() => handleRemoveFile(index)}
              >
                <RiDeleteBinLine size={18} />
              </button>
            </div>
          ))
        )}
      </div>

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
          <span>Drop or select file here</span>
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
