import * as React from "react";
import LocationIcon from "../../../icons/Location.png";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import {useGetAdvertisementByIdQuery, useGetUserAdvertisementsQuery} from "../../../services/apiAdvertisement.ts";
import {useGetUserByIdQuery} from "../../../services/apiUser.ts";
import AdvertisementGallery from "./AdvertisementGallery.tsx";
import {createParentDic, findPath} from "../utils/functions.ts";
import {useGetAllCategoriesQuery} from "../../../services/apiCategory.ts";
import {useNavigate} from "react-router-dom";

import {useGetAreaByIdQuery, useGetSettlementsByIdQuery} from "../../../services/apiNewPost.ts";
import EnvConfig from "../../../config/env.ts";
import {useEffect, useState} from "react";

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
    const {data: UserAdverts} = useGetUserAdvertisementsQuery(
        product?.userId ?? 0,
        { skip: !product?.userId });
    const { data: Categories, error: CategoriesError  } = useGetAllCategoriesQuery();

    //scroll
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        const container = document.getElementById('author-adverts-container');
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            setCanScrollLeft(scrollLeft > 0);
            // Додаємо 1px похибки для точності браузерів
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };
    const scroll = (direction: 'left' | 'right') => {
        const container = document.getElementById('author-adverts-container');
        if (container) {
            const scrollAmount = 1500;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    useEffect(() => {
        checkScroll();
    }, [UserAdverts]);


    if (CategoriesError || !Categories?.payload) {
        return <div>Помилка завантаження категорій</div>;
    }
    if (!product){
        return <div>Помилка завантаження продукта</div>;
    }

    const parentDictionary = createParentDic(Categories.payload);
    const listIdPath = findPath(product.categoryId, parentDictionary)
    const categoryNamesDic = Categories.payload.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
    }, {} as Record<number, string>)
    const namedPath = listIdPath.map(id => categoryNamesDic[id]).join(" / ");

    if (isLoading && isUserLoading) return <div>Завантаження оголошення...</div>;
    if (error || !product) return <div>Оголошення не знайдено</div>;


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

                        {/* DESCRIPTION */}
                        <div className="flex flex-col gap-3 mt-5 max-w-[930px]">
                            <h3 className="text-xl font-semibold">
                                Опис від продавця
                            </h3>
                            <p className="text-[#333]">
                                {product.description}
                            </p>
                        </div>
                    </div>
                    {/* RIGHT */}
                    <div className="flex flex-col gap-4 flex-[1] mt-[40px]">

                    {/* PRICE */}
                        <div className="bg-[#dae5f9] rounded-lg p-6 flex flex-col gap-4 relative">
                            {/* Іконка серця (обране) */}
                            <div className="absolute top-6 right-6 text-[#002f34] cursor-pointer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </div>

                            {/* Назва */}
                            <span className="text-2xl font-medium text-[#002f34] pr-10">
                                {product.name || "Продам кавоварку"}
                            </span>

                            {/* Ціна */}
                            <span className="text-3xl font-bold text-[#002f34] mb-2">
                                {product.price} грн
                            </span>

                            {/* Кнопка Купити */}
                            <button
                                onClick={() => navigate(`/order/${product.id}`)}
                                className="h-12 bg-[#5d87db] text-white rounded-md flex items-center justify-center font-bold hover:bg-[#4a72c2] transition-colors text-lg"
                            >
                                Купити
                            </button>

                            {/* Номер телефону */}
                            <div className="h-12 px-4 rounded-md bg-white flex items-center justify-center text-[#002f34] font-medium text-lg">
                                {seller?.phoneNumber || "(098) XXX XX XX"}
                            </div>

                            {/* Кнопка Повідомлення */}
                            <button className="h-12 bg-white text-[#002f34] rounded-md flex items-center justify-center font-medium hover:bg-gray-50 transition-colors text-lg">
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

                {/* AUTHOR ADS */}
                <div className="mt-10">
                    {/* ШАПКА: Заголовок зліва, Стрілочки справа */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-[#002f34]">
                            Усі оголошення автора
                        </h3>

                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                className={`p-1 transition-all duration-300 rounded-full ${
                                    canScrollLeft
                                        ? "text-[#002f34] cursor-pointer opacity-100 hover:bg-[#dae5f9]"
                                        : "text-gray-500 cursor-default opacity-30"
                                }`}
                            >
                                <RiArrowLeftSLine size={36} />
                            </button>

                            <button
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                className={`p-1 transition-all duration-300 rounded-full rotate-180 ${
                                    canScrollRight
                                        ? "text-[#002f34] cursor-pointer opacity-100 hover:bg-[#dae5f9]"
                                        : "text-gray-500 cursor-default opacity-30"
                                }`}
                            >
                                <RiArrowLeftSLine size={36} />
                            </button>
                        </div>
                    </div>

                    {/* КОНТЕЙНЕР З КАРТКАМИ */}
                    <div
                        id="author-adverts-container"
                        onScroll={checkScroll}
                        className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {UserAdverts?.payload?.map((ad) => (
                            <div
                                key={ad.id}
                                onClick={() => navigate(`/advertisement/${ad.id}`)}
                                className="min-w-[200px] snap-start hover:scale-102 rounded-lg overflow-hidden transition-all cursor-pointer flex flex-col"
                            >
                                <div className="h-[170px] w-fuloverflow-hidden rounded-lg overflow-hidden">
                                    {ad.images?.[0] ? (
                                        <img
                                            src={`${EnvConfig.API_URL}/images/advertisements/1200_${ad.images[0]}`}
                                            alt={ad.name}
                                            className="w-full h-full object-cover transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center ">
                                            Немає фото
                                        </div>
                                    )}
                                </div>

                                {/* ІНФО */}
                                <div className="p-4 flex flex-col gap-2">
                                <span className="text-[#002f34] font-semibold text-lg truncate">
                                    {ad.name}
                                </span>
                                <span className="text-[#002f34] font-bold text-xl">
                                    {ad.price} грн
                                </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvertisementPage;
