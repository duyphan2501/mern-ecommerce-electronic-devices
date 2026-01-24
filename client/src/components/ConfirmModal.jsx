import { FaX } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import { BiLoader } from "react-icons/bi";
import formatMoney from "../utils/MoneyFormat";
import useOrderStore from "../store/orderStore";

const ConfirmModal = ({title, order, confirmMessage, onConfirm, onCancel}) => {
    const {isLoading} = useOrderStore();

  return (
    <div className="fixed inset-0 bg-black/29 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FiAlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-gray-700">
            {confirmMessage}
          </p>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Mã đơn hàng:</span>
              <span className="text-sm font-semibold text-gray-900">
                {order.orderId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng tiền:</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatMoney(order.totalPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Số sản phẩm:</span>
              <span className="text-sm font-semibold text-gray-900">
                {order.items.length} sản phẩm
              </span>
            </div>
          </div>

          <p className="text-sm text-red-600 font-medium">
            Hành động này không thể hoàn tác!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Không, giữ lại
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-red-600 cursor-pointer text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <BiLoader className="w-4 h-4 animate-spin" />
                Đang xử lí
              </>
            ) : (
              <>
                Xác nhận
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
