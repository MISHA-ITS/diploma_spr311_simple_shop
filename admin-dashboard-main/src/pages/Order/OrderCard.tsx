import { IOrder, OrderStatus } from "./types";
import EnvConfig from "../../config/env";
import { useNavigate } from "react-router";

const OrderCard = ({ order }: { order: IOrder }) => {
    const navigate = useNavigate();
    const urlAdImage = `${EnvConfig.API_URL}/images/advertisements`;

    const statusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending:
                return "text-yellow-600";
            case OrderStatus.Accepted:
                return "text-green-600";
            case OrderStatus.Canceled:
                return "text-red-600";
            default:
                return "text-gray-500";
        }
    };

    const statusLabel = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending:
                return "Очікує підтвердження";
            case OrderStatus.Accepted:
                return "Підтверджено";
            case OrderStatus.Canceled:
                return "Скасовано";
            default:
                return "Невідомо";
        }
    };

    return (
        <div className="w-full flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition">

            {/* IMAGE */}
            <div
                className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
            >
                {order.advertisementImage ? (
                    <img
                        src={`${urlAdImage}/400_${order.advertisementImage}`}
                        alt={order.advertisementName ?? ""}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                        Немає фото
                    </div>
                )}
            </div>

            {/* NAME */}
            <div
                className="w-[320px] cursor-pointer"
            >
                <p className="font-medium text-gray-800 break-words leading-snug">
                    {order.advertisementName ?? "Без назви"}
                </p>
            </div>

            {/* STATUS */}
            <div className={`w-40 text-sm font-medium ${statusColor(order.status)}`}>
                {statusLabel(order.status)}
            </div>

            {/* PRICE */}
            <div className="w-28 font-semibold">
                {order.price.toLocaleString()} грн
            </div>

            {/* DATE */}
            <div className="w-32 text-sm text-gray-500">
                {new Date(order.createDate).toLocaleDateString("uk-UA")}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
                <button
                    onClick={() => navigate(`/orderDetails/${order.id}`)}
                    className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                >
                    Деталі
                </button>

                <button
                    className="px-3 py-1 text-sm border rounded-md hover:bg-red-50 text-red-600"
                >
                    Скасувати
                </button>
            </div>
        </div>
    );
};

export default OrderCard;