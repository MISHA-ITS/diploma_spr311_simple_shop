import * as React from "react";
import LocationIcon from "../../icons/Location.png";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useParams, Link } from "react-router-dom";
import {useGetAdvertisementByIdQuery} from "../../store/api/advertisementApi.ts";
import {useGetUserByIdQuery} from "../../store/api/userApi.ts";


const AdvertisementPage: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useGetAdvertisementByIdQuery(Number(id));
    const product = data?.payload;
    const { data: userData, isLoading: isUserLoading } = useGetUserByIdQuery(
        product?.userId ?? 0,
        { skip: !product?.userId } // не робити запит, поки немає продукту
    );
    const seller = userData?.payload;

    if (isLoading && isUserLoading) return <div>Завантаження оголошення...</div>;
    if (error || !product) return <div>Оголошення не знайдено</div>;

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[1430px] px-4 py-8 flex flex-col gap-10">

                {/* BACK */}
                <div className="flex flex-col gap-1 text-sm text-[#6C6C6C]">
                    <Link to={`/`}>
                        <span
                            className="cursor-pointer flex items-center" >
                            <RiArrowLeftSLine /> Повернутись до покупок
                        </span>
                    </Link>
                </div>

                {/* MAIN */}
                <div className="flex gap-8">

                    <div className="flex flex-col gap-4 flex-[2]">

                        {/* BREADCRUMBS */}
                        <span className="text-sm text-[#9A9A9A] h-[24px] flex items-center">
                            Головна / Електроніка / Техніка для кухні / Кавоварки
                        </span>

                        {/* MAIN IMAGE */}
                        <div className="w-full h-[430px] bg-[#BDBDBD] rounded-lg" />

                        {/* THUMBNAILS */}
                        <div className="flex gap-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[160px] h-[100px] bg-[#BDBDBD] rounded-md"
                                />
                            ))}
                        </div>
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
                                <p className="font-semibold">{seller?.firstName}</p>
                                <p className="text-[#555]">Професійний продавець</p>
                                <p className="text-[#555]">⭐ 5 років на сервісі</p>
                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6 flex gap-2 text-sm">
                            <img src={LocationIcon} className="w-5 h-6" />
                            <span>
                                Рівне, Рівненська область <br />
                                34 км від вас
                            </span>
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
