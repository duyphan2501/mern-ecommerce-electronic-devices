
const TextInput = ({placeholder}) => {
  return (
    <div>
      <input
        type="text"
        className="border-none bg-gray-100 rounded-lg w-full p-3 focus:outline-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;
