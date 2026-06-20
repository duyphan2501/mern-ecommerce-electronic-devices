import { BiLoader } from "react-icons/bi";
import { FiAlertCircle } from "react-icons/fi";
import formatMoney from "../utils/MoneyFormat";
import useOrderStore from "../store/orderStore";

const ConfirmModal = ({ title, order, confirmMessage, onConfirm, onCancel }) => {
  const { isLoading } = useOrderStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
            <FiAlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-gray-700">{confirmMessage}</p>

          <div className="space-y-2 rounded-md bg-gray-50 p-4">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-600">Mã đơn hàng:</span>
              <span className="text-sm font-semibold text-gray-900">
                {order.orderId}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-600">Tổng tiền:</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatMoney(order.totalPrice)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-600">Số sản phẩm:</span>
              <span className="text-sm font-semibold text-gray-900">
                {order.items.length} sản phẩm
              </span>
            </div>
          </div>

          <p className="text-sm font-medium text-red-600">
            Hành động này không thể hoàn tác!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-md bg-gray-200 px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Không, giữ lại
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <BiLoader className="h-4 w-4 animate-spin" />
                Đang xử lí
              </>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
