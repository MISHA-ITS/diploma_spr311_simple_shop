import * as React from "react";
import LocationIcon from "../../../icons/Location.png";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import {useGetAdvertisementByIdQuery} from "../../../services/apiAdvertisement.ts";
import {useGetUserByIdQuery} from "../../../services/apiUser.ts";
import AdvertisementGallery from "./AdvertisementGallery.tsx";
import {createParentDic, findPath} from "../utils/functions.ts";
import {useGetAllCategoriesQuery} from "../../../services/apiCategory.ts";
import {useNavigate} from "react-router-dom";
import { TbTruckDelivery } from "react-icons/tb";
import {useGetAreaByIdQuery, useGetSettlementsByIdQuery} from "../../../services/apiNewPost.ts";

const AdvertisementPage: React.FC = () => {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useGetAdvertisementByIdQuery(Number(id));
    const product = data?.payload;
    const { data: settlement } = useGetSettlementsByIdQuery(
        product?.settlementRef ?? "",
        { skip: !product?.settlementRef }
    );
    const { data: area } = useGetAreaByIdQuery(
        settlement?.area ?? "",
        { skip: !settlement?.area }
    );
    const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(
        product?.userId ?? 0,
        { skip: !product?.userId }
    );
    const seller = userData?.payload;
    const { data: Categories, error: CategoriesError  } = useGetAllCategoriesQuery();
    if (CategoriesError || !Categories?.payload) {
        return <div>Помилка завантаження категорій</div>;
    }
    if (!product){
        return <div>Помилка завантаження продукта</div>;
    }

    console.log(area);

    const parentDictionary = createParentDic(Categories.payload);
    const listIdPath = findPath(product.categoryId, parentDictionary)
    const categoryNamesDic = Categories.payload.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
    }, {} as Record<number, string>)
    const namedPath = listIdPath.map(id => categoryNamesDic[id]).join(" / ");

    if (isLoading && isUserLoading) return <div>Завантаження оголошення...</div>;
    if (error || !product) return <div>Оголошення не знайдено</div>;

    console.log(settlement)

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[1430px] px-4 py-8 flex flex-col gap-10">

                {/* BACK */}
                <button
                    onClick={() => navigate("/")}
                    className="w-fit flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-4"
                >
                    <RiArrowLeftSLine /> Повернутись до покупок
                </button>

                {/* MAIN */}
                <div className="flex gap-8">
                    <div className="flex flex-col gap-4 flex-[2]">
                        {/* BREADCRUMBS */}
                        <span className="text-sm  h-[24px] flex items-center">
                            {namedPath}
                        </span>

                        <AdvertisementGallery images={product.images} />
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-4 flex-[1] mt-[40px]">

                    {/* PRICE */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6 flex flex-col gap-4">
                            <span className="text-xl font-semibold">
                                {product.name}
                            </span>

                            <span className="text-2xl font-bold">
                                {product.price} грн
                            </span>

                            <button onClick={() => navigate(`/order/${product.id}`)} className="h-11 bg-white text-[#002f34] border-2 border-[#002f34] rounded-md flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-colors">
                                <TbTruckDelivery size={"25px"}/>
                                Купити з доставкою
                            </button>
                            <div className="h-11 px-4 rounded-md border border-gray-300 bg-white flex items-center justify-center text-[#6C6C6C]">
                                {seller?.phoneNumber || "Номер не вказано"}
                            </div>

                            <button className="h-11 bg-[#6C6C6C] text-white rounded-md">
                                Повідомлення
                            </button>
                        </div>

                        {/* SELLER */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6 flex gap-4">
                            <div className="w-12 h-12 bg-[#BDBDBD] rounded-full" />
                            <div className="text-sm">
                                <p className="font-semibold">{seller?.lastName} {seller?.firstName}</p>
                                <p className="text-[#555]">Професійний продавець</p>
                                <p className="text-[#555]">⭐ 5 років на сервісі</p>
                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-[#002f34] mb-6">
                                Місцезнаходження
                            </h3>

                            <div className="flex gap-4 items-start">
                                {/* Іконка локації */}
                                <div className="mt-1">
                                    <img src={LocationIcon} className="w-5 h-6 opacity-80" alt="location" />
                                </div>

                                {/* Текстовий блок */}
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-[#002f34]">
                                        {settlement?.description || "Місто"}
                                    </span>
                                    <span className="text-[#406367] text-lg mt-1">
                                        {area?.description ? `${area.description} область` : "Область"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col gap-3 max-w-[930px]">
                    <h3 className="text-xl font-semibold">
                        Опис від продавця
                    </h3>
                    <p className="text-[#333]">
                        {product.description}
                    </p>
                </div>

                {/* AUTHOR ADS */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Усі оголошення автора
                    </h3>

                    <div className="flex gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-[260px] h-[180px] bg-[#BDBDBD] rounded-lg"
                            />
                        ))}
                    </div>
                </div>

                {/* SIMILAR ADS */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Схожі оголошення
                    </h3>

                    <div className="flex gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-[260px] h-[180px] bg-[#BDBDBD] rounded-lg"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvertisementPage;
