import { useMemo, useState } from "react";
import OrderTabs from "./OrderTabs";
import OrderCard from "./OrderCard";
import {IOrder, OrderStatus} from "./types.ts";

interface Props {
    buyerOrders: IOrder[];
    sellerOrders: IOrder[];
}

const DeliverySection = ({ buyerOrders, sellerOrders }: Props) => {
    const [orderType, setOrderType] = useState<"buyer" | "seller">("buyer");
    const [statusTab, setStatusTab] = useState<"all" | OrderStatus>("all");

    const orders = orderType === "buyer" ? buyerOrders : sellerOrders;

    const filteredOrders = useMemo(() => {
        if (statusTab === "all") return orders;
        return orders.filter(o => o.status === statusTab);
    }, [orders, statusTab]);

    return (
        <>
            {/* BUYER / SELLER SWITCH */}
            <div className="flex gap-6 mb-6">
                <button
                    onClick={() => setOrderType("buyer")}
                    className={orderType === "buyer" ? "font-semibold border-b-2 border-black pb-1" : ""}
                >
                    Мої покупки
                </button>

                <button
                    onClick={() => setOrderType("seller")}
                    className={orderType === "seller" ? "font-semibold border-b-2 border-black pb-1" : ""}
                >
                    Мої продажі
                </button>
            </div>

            <OrderTabs
                orders={orders}
                statusTab={statusTab}
                setStatusTab={setStatusTab}
            />

            {filteredOrders.length === 0 ? (
                <div className="text-center mt-20 text-gray-500">
                    Замовлень немає
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </>
    );
};

export default DeliverySection;