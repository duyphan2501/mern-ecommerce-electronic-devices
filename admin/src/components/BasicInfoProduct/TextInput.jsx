const TextInput = ({ placeholder = "", value = "", onChange }) => {
  return (
    <div>
      <input
        type="text"
        className="border-none bg-gray-100 rounded-lg w-full p-3 focus:outline-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
};

export default TextInput;
