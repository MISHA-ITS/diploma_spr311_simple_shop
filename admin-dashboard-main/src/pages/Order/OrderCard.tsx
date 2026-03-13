import { useState } from "react";
import { apiOrder } from "../../services/apiOrder";
import { OrderStatus, OrderResponseDto } from "./types";
import EnvConfig from "../../config/env";
import {useAppSelector} from "../../store";

interface OrderCardProps {
    order: OrderResponseDto;
}

const OrderDetailsSkeleton = () => {
    return (
        <div className="grid grid-cols-2 gap-8 mt-4 animate-pulse">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <div className="h-5 w-32 bg-gray-300 rounded"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-36 bg-gray-200 rounded"></div>
                    <div className="h-4 w-44 bg-gray-200 rounded"></div>
                </div>
            ))}
        </div>
    );
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const urlAdImage = `${EnvConfig.API_URL}/images/advertisements`;

    const [isExpanded, setIsExpanded] = useState(false);

    const { data: fullOrder, isFetching } = apiOrder.useGetOrderByIdQuery(order.id, {
        skip: !isExpanded,
    });
    const orderDetails = fullOrder?.payload;
    console.log("Order details", order);

    const currentUserId = useAppSelector(state => state.auth.user?.id);

    const userId = Number(currentUserId);

    const isBuyer = userId === order.buyerId;
    const isSeller = userId === order.sellerId;

    console.log({
        user: currentUserId,
        buyer: order.buyerId,
        seller: order.sellerId,
        isBuyer,
        isSeller,
        status: order.status
    });

    const [cancelOrder] = apiOrder.useCancelOrderMutation();
    const [updateStatus] = apiOrder.useUpdateOrderStatusMutation();

    const statusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending:
                return "text-yellow-600";
            case OrderStatus.Accepted:
                return "text-green-600";
            case OrderStatus.Canceled:
                return "text-red-600";
            case OrderStatus.Rejected:
                return "text-red-600";
            case OrderStatus.Shipped:
                return "text-blue-600";
            case OrderStatus.Completed:
                return "text-green-700";
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
            case OrderStatus.Rejected:
                return "Відхилено";
            case OrderStatus.Shipped:
                return "Відправлено";
            case OrderStatus.Completed:
                return "Завершено";
            default:
                return "Невідомо";
        }
    };

    const handleCancel = async () => {
        const ok = confirm("Ви впевнені, що хочете скасувати замовлення?");
        if (!ok) return;

        try {
            await cancelOrder(order.id).unwrap();
            alert("Замовлення скасовано");
        } catch {
            alert("Помилка скасування замовлення");
        }
    };

    const renderActions = () => {
        if (order.status === OrderStatus.Pending && isSeller) {
            return (
                <>
                    <button
                        onClick={() => handleStatusChange(OrderStatus.Accepted)}
                        className="px-3 py-1 text-sm border rounded-md hover:bg-green-50"
                    >
                        Підтвердити продаж
                    </button>

                    <button
                        onClick={() => handleStatusChange(OrderStatus.Rejected)}
                        className="px-3 py-1 text-sm border rounded-md hover:bg-red-50"
                    >
                        Відхилити
                    </button>
                </>
            );
        }

        if (order.status === OrderStatus.Accepted && isSeller) {
            return (
                <button
                    onClick={() => handleStatusChange(OrderStatus.Shipped)}
                    className="px-3 py-1 text-sm border rounded-md hover:bg-blue-50"
                >
                    Підтвердити відправку
                </button>
            );
        }

        if (order.status === OrderStatus.Shipped && isBuyer) {
            return (
                <button
                    onClick={() => handleStatusChange(OrderStatus.Completed)}
                    className="px-3 py-1 text-sm border rounded-md hover:bg-green-50"
                >
                    Підтвердити отримання
                </button>
            );
        }

        return null;

        // switch (order.status) {
        //     case OrderStatus.Pending:
        //         return (
        //             <>
        //                 <button
        //                     onClick={() => handleStatusChange(OrderStatus.Accepted)}
        //                     className="px-3 py-1 text-sm border rounded-md bg-green-50 text-green-600"
        //                 >
        //                     Підтвердити продаж
        //                 </button>
        //
        //                 <button
        //                     onClick={() => handleStatusChange(OrderStatus.Rejected)}
        //                     className="px-3 py-1 text-sm border rounded-md bg-red-50 text-red-600"
        //                 >
        //                     Відхилити
        //                 </button>
        //             </>
        //         );
        //
        //     case OrderStatus.Accepted:
        //         return (
        //             <button
        //                 onClick={() => handleStatusChange(OrderStatus.Shipped)}
        //                 className="px-3 py-1 text-sm border rounded-md bg-blue-50 text-blue-600"
        //             >
        //                 Підтвердити відправку
        //             </button>
        //         );
        //
        //     case OrderStatus.Shipped:
        //         return (
        //             <button
        //                 onClick={() => handleStatusChange(OrderStatus.Completed)}
        //                 className="px-3 py-1 text-sm border rounded-md bg-green-50 text-green-600"
        //             >
        //                 Підтвердити отримання
        //             </button>
        //         );
        //
        //     default:
        //         return null;
        // }
    };

    const handleStatusChange = async (status: OrderStatus) => {
        try {
            await updateStatus({
                id: order.id,
                status: status
            }).unwrap();

            alert("Статус оновлено");
        } catch {
            alert("Помилка оновлення статусу");
        }
    };

    return (
        <div className="w-full flex flex-col gap-2 p-4 bg-white border rounded-xl hover:shadow-md transition-all">

            {/* TOP INFO */}
            <div className="flex items-center gap-4">

                {/* IMAGE */}
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
                <div className="w-[320px]">
                    <p className="font-medium text-gray-800 break-words leading-snug">
                        {order.advertisementName ?? "Без назви"}
                    </p>
                    <p className="w-32 text-sm text-gray-500">
                        № замовлення: {order.id}
                    </p>
                </div>

                {/* STATUS */}
                <div className={`w-40 text-sm font-medium ${statusColor(order.status)}`}>
                    {statusLabel(order.status)}
                </div>

                {/* PRICE */}
                <div className="w-28 font-semibold">
                    {order.price?.toLocaleString()} грн
                </div>

                {/* DATE */}
                <div className="w-32 text-sm text-gray-500">
                    {new Date(order.createDate).toLocaleDateString("uk-UA")}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsExpanded(prev => !prev)}
                        className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100 transition"
                    >
                        {isExpanded ? "Стисло" : "Деталі"}
                    </button>

                    {renderActions()}

                    {order.status !== OrderStatus.Completed &&
                        order.status !== OrderStatus.Canceled &&
                        order.status !== OrderStatus.Rejected && (
                            <button
                                onClick={handleCancel}
                                className="px-3 py-1 text-sm border rounded-md hover:bg-red-50 text-red-600 transition"
                            >
                                Скасувати
                            </button>
                        )}

                </div>
            </div>

            {/* EXPANDABLE DETAILS */}
            <div
                className={`overflow-hidden transition-all duration-500 ${
                    isExpanded
                        ? "max-h-[400px] opacity-100 mt-4 border-t pt-4"
                        : "max-h-0 opacity-0"
                }`}
            >
                {isFetching && <OrderDetailsSkeleton />}

                {!isFetching && orderDetails && (
                    <div className="grid grid-cols-2 gap-8 text-sm">

                        {/* BUYER */}
                        <div>
                            <p className="font-semibold mb-2">ХТО КУПИВ</p>

                            <p>Ім'я: {orderDetails.buyerFirstName ?? "—"}</p>

                            <p>Прізвище: {orderDetails.buyerLastName ?? "—"}</p>

                            <p>Телефон: {orderDetails.buyerPhone ?? "—"}</p>

                            <p>Місце знаходження: {orderDetails.buyerLocation ?? "—"}</p>
                        </div>

                        {/* SELLER */}
                        <div>
                            <p className="font-semibold mb-2">ПРОДАВЕЦЬ</p>

                            <p>Ім'я: {orderDetails.sellerFirstName ?? "—"}</p>

                            <p>Прізвище: {orderDetails.sellerLastName ?? "—"}</p>

                            <p>Телефон: {orderDetails.sellerPhone ?? "—"}</p>

                            <p>Місце знаходження: {orderDetails.sellerLocation ?? "—"}</p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderCard;