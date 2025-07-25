import { useState, useEffect, useRef } from "react";
import {
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa";

const TextAlignBtn = ({ editor }) => {
  const alignments = [
    {
      id: "left",
      icon: <FaAlignLeft />,
      title: "Align Left",
    },
    {
      id: "center",
      icon: <FaAlignCenter />,
      title: "Align Center",
    },
    {
      id: "right",
      icon: <FaAlignRight />,
      title: "Align Right",
    },
    {
      id: "justify",
      icon: <FaAlignJustify />,
      title: "Align Justify",
    },
  ];

  const [activeId, setActiveId] = useState("left");
  const [open, setOpen] = useState(false);
  
  const handleClick = (id) => {
    editor.chain().focus().setTextAlign(id).run();
    setActiveId(id);
    setOpen(!open);
  };

  const alignRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alignRef.current && !alignRef.current.contains(event.target)) {
        setOpen(false);
      } 
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative h-full" ref={alignRef}>
      {alignments
        .filter((item) => item.id === activeId)
        .map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`p-2 rounded bg-gray-100 hover:bg-gray-200`}
            title={item.title}
          >
            {item.icon}
          </button>
        ))}

      {open && <div className="absolute flex flex-col items-center top-[100%] left-0 bg-white z-10 shadow rounded mt-1">
        {alignments
          .filter((item) => item.id !== activeId)
          .map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`p-2 rounded hover:bg-gray-100`}
              title={item.title}
            >
              {item.icon}
            </button>
          ))}
      </div>}
    </div>
  );
};

export default TextAlignBtn;
