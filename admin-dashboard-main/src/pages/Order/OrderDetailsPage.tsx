import {useParams} from "react-router-dom";
import {useGetOrderByIdQuery} from "../../services/apiOrder.ts";
import EnvConfig from "../../config/env.ts";

const OrderDetailsPage = () => {

    const { id } = useParams();
    const { data, isLoading } = useGetOrderByIdQuery(Number(id));

    const urlUserImage = `${EnvConfig.API_URL}/images/users`;

    if (isLoading) return <div>Завантаження...</div>;

    const order = data?.payload;
    console.log(order);

    if (!order) return <div>Замовлення не знайдено</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">

            <h1 className="text-xl font-semibold mb-6">
                Деталі замовлення #{order.id}
            </h1>

            <div className="grid grid-cols-2 gap-6">

                {/* PRODUCT */}
                <div>
                    <h2 className="font-semibold mb-2">Товар</h2>
                    <p>{order.advertisementName}</p>
                    <p className="text-lg font-semibold mt-2">
                        {order.price} грн
                    </p>
                </div>

                {/* STATUS */}
                <div>
                    <h2 className="font-semibold mb-2">Статус</h2>
                    <p>{order.status}</p>
                </div>

                {/* BUYER */}
                <div>
                    <h2 className="font-semibold mb-2">Покупець</h2>
                    <div className="flex items-center gap-3">
                        <img
                            src={`${urlUserImage}/50_${order.buyerImage}`}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p>{order.buyerFullName}</p>
                            <p className="text-sm text-gray-500">{order.buyerEmail}</p>
                        </div>
                    </div>
                </div>

                {/* SELLER */}
                <div>
                    <h2 className="font-semibold mb-2">Продавець</h2>
                    <div className="flex items-center gap-3">
                        <img
                            src={`${urlUserImage}/50_${order.sellerImage}`}
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p>{order.sellerFullName}</p>
                            <p className="text-sm text-gray-500">{order.sellerEmail}</p>
                        </div>
                    </div>
                </div>

                {/* DATE */}
                <div>
                    <h2 className="font-semibold mb-2">Дата</h2>
                    <p>{new Date(order.createDate).toLocaleString()}</p>
                </div>

            </div>

        </div>
    );
};

export default OrderDetailsPage;