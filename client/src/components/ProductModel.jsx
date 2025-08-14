import { FaCheck } from 'react-icons/fa'

const ProductModel = ({model, isSelected, onSelect}) => {
  return (
    <div className={`w-fit flex gap-2 items-center p-3 rounded-md hover:outline-2 outline-1 outline-gray-200 hover:outline-blue-500 relative overflow-hidden ${isSelected?"!outline-2 !outline-blue-500": "cursor-pointer"}`} onClick={onSelect}>
        {/* <div className="size-10">
            <img src={model.image} alt="" className='size-full object-cover'/>
        </div> */}
        <p className='text-sm line-clamp-1'>{model.modelName}</p>
        <div className={`absolute -top-1 -right-1 size-4 rounded-full flex justify-center items-center bg-blue-500 ${isSelected?"block":"hidden"}`}>
            <FaCheck size={10} className='text-white'/>
        </div>
    </div>
  )
}

export default ProductModel