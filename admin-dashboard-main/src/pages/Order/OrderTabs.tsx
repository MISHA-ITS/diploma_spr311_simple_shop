import { IOrder, OrderStatus } from "./types";

interface Props {
    orders: IOrder[];
    statusTab: OrderStatus | "all";
    setStatusTab: React.Dispatch<React.SetStateAction<OrderStatus | "all">>;
}

const OrderTabs = ({ orders, statusTab, setStatusTab }: Props) => {

    const counters = {
        all: orders.length,
        [OrderStatus.Pending]: orders.filter(o => o.status === OrderStatus.Pending).length,
        [OrderStatus.Accepted]: orders.filter(o => o.status === OrderStatus.Accepted).length,
        [OrderStatus.Rejected]: orders.filter(o => o.status === OrderStatus.Rejected).length,
        [OrderStatus.Shipped]: orders.filter(o => o.status === OrderStatus.Shipped).length,
        [OrderStatus.Completed]: orders.filter(o => o.status === OrderStatus.Completed).length,
        [OrderStatus.Canceled]: orders.filter(o => o.status === OrderStatus.Canceled).length,
    };

    const tabs: { key: OrderStatus | "all"; label: string }[] = [
        { key: "all", label: "Всі" },
        { key: OrderStatus.Pending, label: "Очікує" },
        { key: OrderStatus.Accepted, label: "Прийнято" },
        { key: OrderStatus.Rejected, label: "Відхилено" },
        { key: OrderStatus.Shipped, label: "Відправлено" },
        { key: OrderStatus.Completed, label: "Завершено" },
        { key: OrderStatus.Canceled, label: "Скасовано" },
    ];

    return (
        <div className="flex gap-6 text-sm mb-8 border-b pb-3">
            {tabs.map(tab => (
                <button
                    key={tab.key.toString()}
                    onClick={() => setStatusTab(tab.key)}
                    className={`pb-2 font-medium ${
                        statusTab === tab.key
                            ? "text-black border-b-2 border-black"
                            : "text-gray-400 hover:text-black"
                    }`}
                >
                    {tab.label} ({counters[tab.key]})
                </button>
            ))}
        </div>
    );
};

export default OrderTabs;