import {IOrder} from "./types.ts";
import EnvConfig from "../../config/env.ts";
import {useNavigate} from "react-router";

const OrderCard = ({ order }: { order: IOrder }) => {
    const navigate = useNavigate();
    const urlAdImage = `${EnvConfig.API_URL}/images/advertisements`;

    return (
        <div className="border rounded-xl p-4 bg-white hover:shadow-lg transition cursor-pointer flex gap-4">

            {/* IMAGE */}
            <div
                key={order.id}
                onClick={() => navigate(`/orderDetails/${order.id}`)}
                className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

            {/* INFO */}
            <div className="flex flex-col justify-between">
                <h3 className="font-medium text-sm truncate">
                    {order.advertisementName ?? "Без назви"}
                </h3>

                <p className="text-base font-semibold">
                    {order.price.toLocaleString()} грн
                </p>

                <p className="text-xs text-gray-400">
                    {new Date(order.createDate).toLocaleDateString("uk-UA")}
                </p>
            </div>
        </div>
    );
};

export default OrderCard;