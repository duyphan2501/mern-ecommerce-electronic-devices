
const OrderItemExpand = ({ products }) => {
  return (
    <tr>
      <td colSpan={9} className="pl-6 bg-white">
        <div className="overflow-x-auto w-fit border border-gray-200 rounded shadow-md">
          <table className="w-full ">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Tên sản phẩm</th>
                <th className="px-4 py-2">Hình ảnh</th>
                <th className="px-4 py-2">Số lượng</th>
                <th className="px-4 py-2">Đơn giá</th>
                <th className="px-4 py-2">Tổng cộng</th>
              </tr>
            </thead>  
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 object-contain"
                    />
                  </td>
                  <td className="px-4 py-2">{p.quantity}</td>
                  <td className="px-4 py-2">{p.price.toLocaleString()}đ</td>
                  <td className="px-4 py-2">
                    {(p.price * p.quantity).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
};

export default OrderItemExpand;
