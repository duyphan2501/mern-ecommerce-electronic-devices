import { useEffect, useRef, useState } from "react";
import { FaPalette } from "react-icons/fa";

const presetColors = [
  "#000000",
  "#e53935",
  "#fb8c00",
  "#fdd835",
  "#43a047",
  "#1e88e5",
  "#8e24aa",
  "#795548",
  "#607d8b",
  "#ffffff",
];

const ColorPickerBtn = ({ editor }) => {
  const [showPalette, setShowPalette] = useState(false);
    const pickerRef = useRef(null);

  const applyColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setShowPalette(false);
    setActiveColor(color);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [activeColor, setActiveColor] = useState(presetColors[0]);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setShowPalette((prev) => !prev)}
        className="p-2 rounded bg-gray-100 hover:bg-gray-200"
        title="Text Color"
      >
        <FaPalette style={{ color: activeColor }} />
      </button>

      {showPalette && (
        <div className="absolute z-10 top-[110%] left-0 bg-white shadow rounded p-2 grid grid-cols-5 gap-2 w-42">
          {presetColors.map((color, index) => (
            <button
              key={index}
              onClick={() => applyColor(color)}
              className="w-6 h-6 rounded-full border hover:scale-110 transition"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPickerBtn;
