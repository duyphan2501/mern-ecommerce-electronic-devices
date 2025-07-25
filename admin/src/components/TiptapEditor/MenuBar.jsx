import { useEffect, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaMinus,
  FaUnderline,
} from "react-icons/fa";
import HeadingSelect from "./HeadingSelect";
import TextAlignBtn from "./TextAlignBtn";
import ColorPickerBtn from "./ColorPickerBtn";

const MenuBar = ({ editor }) => {
  const [activeFormats, setActiveFormats] = useState({});

  const updateActiveFormats = () => {
    if (!editor) return;

    setActiveFormats({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
    });
  };

  useEffect(() => {
    if (!editor) return;

    // Lắng nghe khi selection hoặc content thay đổi để cập nhật trạng thái
    editor.on("selectionUpdate", updateActiveFormats);
    editor.on("transaction", updateActiveFormats);

    // Cleanup khi component bị unmount
    return () => {
      editor.off("selectionUpdate", updateActiveFormats);
      editor.off("transaction", updateActiveFormats);
    };
  }, [editor]);

  return (
    <div className="flex gap-2 flex-wrap mb-2">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded bg-gray-100 hover:bg-gray-200 ${
          activeFormats.bold ? "text-blue-500" : ""
        }`}
        title="Bold"
      >
        <FaBold />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded bg-gray-100 hover:bg-gray-200 ${
          activeFormats.italic ? "text-blue-500" : ""
        }`}
        title="Italic"
      >
        <FaItalic />
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded bg-gray-100 hover:bg-gray-200 ${
          activeFormats.underline ? "text-blue-500" : ""
        }`}
        title="Underline"
      >
        <FaUnderline />
      </button>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded bg-gray-100 hover:bg-gray-200 ${
          activeFormats.bulletList ? "text-blue-500" : ""
        }`}
        title="Bullet List"
      >
        <FaListUl />
      </button>

      {/* Ordered List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded bg-gray-100 hover:bg-gray-200 ${
          activeFormats.orderedList ? "text-blue-500" : ""
        }`}
        title="Ordered List"
      >
        <FaListOl />
      </button>

      {/* Horizontal Rule */}
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded bg-gray-100 hover:bg-gray-200"
        title="Insert Horizontal Rule"
      >
        <FaMinus />
      </button>

      {/* Alignment */}
      <TextAlignBtn editor={editor} activeFormats={activeFormats} />

      {/* Text Color Dropdown */}
      <ColorPickerBtn editor={editor} />
      
      {/* Heading Select */}
      <HeadingSelect
        selectItems={[
          { key: "Normal Text", value: 0 },
          { key: "Heading 1", value: 1 },
          { key: "Heading 2", value: 2 },
          { key: "Heading 3", value: 3 },
          { key: "Heading 4", value: 4 },
          { key: "Heading 5", value: 5 },
          { key: "Heading 6", value: 6 },
        ]}
        editor={editor}
      />
    </div>
  );
};

export default MenuBar;
