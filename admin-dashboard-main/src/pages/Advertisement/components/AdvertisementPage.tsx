import * as React from "react";
import LocationIcon from "../../../icons/Location.png";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import {useGetAdvertisementByIdQuery, useGetUserAdvertisementsQuery} from "../../../services/apiAdvertisement.ts";
import {
    useGetUserByIdQuery,
} from "../../../services/apiUser.ts";
import AdvertisementGallery from "./AdvertisementGallery.tsx";
import {createParentDic, findPath} from "../utils/functions.ts";
import {useGetAllCategoriesQuery} from "../../../services/apiCategory.ts";
import {useNavigate} from "react-router-dom";

import {useGetAreaByIdQuery} from "../../../services/apiNewPost.ts";
import EnvConfig from "../../../config/env.ts";
import {useEffect, useState} from "react";
import {
    useAddToFavoritesMutation,
    useProfileQuery,
    useRemoveFromFavoritesMutation
} from "../../../services/apiAccount.ts";
import {FaHeart, FaPen, FaRegHeart} from "react-icons/fa";
import {IAdvertisement} from "../types.ts";
import {toast, ToastContainer} from "react-toastify";

const AdvertisementPage: React.FC = () => {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation();
    const [removeFromFavorites, { isLoading: isRemoving }] = useRemoveFromFavoritesMutation();
    const { data, isLoading, error } = useGetAdvertisementByIdQuery(Number(id));
    const product = data?.payload;
    const { data: profile } = useProfileQuery();
    const User = profile?.payload;

    const { data: area } = useGetAreaByIdQuery(
        product?.settlement?.area ?? "",
        { skip: !product?.settlement?.area },
    );
    const { data: sellerData, isLoading: isSellerLoading } = useGetUserByIdQuery(
        product?.userId ?? 0,
        { skip: !product?.userId }
    );
    const seller = sellerData?.payload;

    const isSeller = User && product && User.id === product.userId;
    //favorite
    const {data: profileData} = useProfileQuery()
    const isFavorite = profileData?.payload?.favoriteAdverts?.some(fav => fav.id === product?.id);

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

    useEffect(() => {
        if (product) {
            const stored = localStorage.getItem('recentlyViewed');
            let list: IAdvertisement[] = stored ? JSON.parse(stored) : [];

            // Видаляємо дублікат, якщо він уже був
            list = list.filter(item => item.id !== product.id);

            // Додаємо новий товар на початок списку
            list.unshift(product);

            // Залишаємо лише останні, наприклад, 10-20 переглядів
            list = list.slice(0, 20);

            localStorage.setItem('recentlyViewed', JSON.stringify(list));
        }
    }, [product]);

    if (CategoriesError || !Categories?.payload) {
        return null;
    }

    console.log(product);
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

    if (isLoading && isSellerLoading) return <div>Завантаження оголошення...</div>;
    if (error || !product) return <div>Оголошення не знайдено</div>;

    const handleFavoriteClick = async () => {
        if (!User) {
            toast.info("Будь ласка, увійдіть в акаунт, щоб додати товар у вибрані", {});
            return;
        }

        if (isAdding || isRemoving) return;

        try {
            if (isFavorite) {
                await removeFromFavorites(product.id).unwrap();
            } else {
                await addToFavorites(product.id).unwrap();
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                            <div className="absolute top-6 right-6 flex items-center gap-4">
                                {isSeller && (
                                    <div
                                        onClick={() => navigate(`/edit-advertisement/${product.id}`)}
                                        className="cursor-pointer transition-all duration-300 transformtext-[#002f34] opacity-80 hover:opacity-100"
                                    >
                                        <FaPen size={28} color="#002f34" />
                                    </div>
                                )}
                                <div
                                    onClick={handleFavoriteClick}
                                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 
                                    ${(isAdding || isRemoving) ? 'opacity-50 pointer-events-none' : 'opacity-100'}
                                    ${!User ? 'grayscale-[0.5]' : ''}`} // трохи приглушити для неавторизованих
                                >
                                    {isFavorite ? (
                                        <FaHeart size={30} color="#ff4f4f" /> // червоний??
                                    ) : (
                                        <FaRegHeart size={30} color="#002f34" />
                                    )}
                                </div>
                            </div>

                            {/* Назва */}
                            <span className="text-2xl font-medium text-[#002f34] pr-14">
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
                        </div>

                        {/* SELLER */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6 flex gap-4">
                            <div className="w-12 h-12 bg-[#BDBDBD] rounded-full overflow-hidden">
                                <img
                                    className="w-full h-full object-cover" src={seller?.image
                                    ? `${EnvConfig.API_URL}/images/users/1200_${seller.image}`
                                    : `${EnvConfig.API_URL}/images/noimage.jpeg`
                                    }
                                />
                            </div>
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
                                        {product.settlement?.description || "Місто"}
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
                        {UserAdverts?.payload?.map((ad) => {
                            // Знаходимо головне фото або беремо перше з масиву
                            const mainImgUrl = ad.images.find(img => img.isMain)?.imageUrl || ad.images[0]?.imageUrl;

                            return (
                                <div
                                    key={ad.id}
                                    onClick={() => {
                                        navigate(`/advertisement/${ad.id}`);
                                        window.scrollTo(0, 0); // Щоб сторінка відкрилася зверху
                                    }}
                                    className="w-[218px] flex-shrink-0 snap-start hover:scale-102 rounded-lg overflow-hidden transition-all cursor-pointer flex flex-col group"
                                >
                                    {/* ФОТО */}
                                    <div className="h-[170px] w-full overflow-hidden rounded-lg bg-gray-100">
                                        {mainImgUrl ? (
                                            <img
                                                src={`${EnvConfig.API_URL}/images/advertisements/1200_${mainImgUrl}`}
                                                alt={ad.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
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
                            );
                        })}
                        <ToastContainer position="bottom-right" autoClose={3000} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvertisementPage;
