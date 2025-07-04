import { useEffect, useState } from "react"
import { FaMinus, FaPlus } from "react-icons/fa6"

const QuantityCartBtn = ({quan}) => {
    const [quantity, setQuantity] = useState(quan)
    useEffect(() => {
        if (quantity < 1)
            setQuantity(1)
    }, [quantity])

    const handleChange = (e) => {
        const val = e.target.value
        if (/^\d*$/.test(val)) {
            const num = Number(val)
            setQuantity(num < 1 ? 1 : num)
        }
    }

  return (
    <div className="flex gap-1 items-center">
        <div className="size-9 rounded-full font-black bg-gray-100 border border-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-300" onClick={() => setQuantity(quantity - 1)}><FaMinus /></div>
        <input className="size-9 text-center outline-0" value={quantity} onChange={(e) => handleChange(e)   }/>
        <div className="size-9 rounded-full font-black bg-gray-100 border border-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-300" onClick={() => setQuantity(quantity + 1)}><FaPlus /></div>
    </div>
  )
}

export default QuantityCartBtn