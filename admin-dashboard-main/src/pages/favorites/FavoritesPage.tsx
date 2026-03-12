import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';
import EnvConfig from "../../config/env.ts";
import {
    useProfileQuery,
    useRemoveAllFromFavoritesMutation,
    useRemoveFromFavoritesMutation
} from "../../services/apiAccount.ts";
import {IoStatsChart} from "react-icons/io5";
import Loader from "../../components/Loader.tsx";

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: userData, isLoading } = useProfileQuery();
    const favorites = userData?.payload?.favoriteAdverts || [];
    const [removeFromFavorites] = useRemoveFromFavoritesMutation();
    const [remoceAllFavorites] = useRemoveAllFromFavoritesMutation();

    if (isLoading) return <Loader />;

    console.log("FavoritesPage", userData);

    const handleDeleteFavorite = async (id:number) => {
        try {
            await removeFromFavorites(id).unwrap();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAllFavorite = async () => {
        try {
            await remoceAllFavorites().unwrap();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full bg-[#f2f4f5] min-h-screen pb-20">
            <div className="max-w-[1250px] mx-auto px-4 pt-10">
                <h1 className="text-3xl font-bold text-[#002f34] text-center mb-10">Обрані</h1>

                {/* Таби та кнопка очищення */}
                <div className="flex justify-between items-center border-b border-gray-200 mb-8">
                    <div className="flex gap-10">
                        <button className="pb-4 text-blue-500 border-b-2 border-blue-500 font-medium text-sm">Вибрані оголошення</button>
                        <button className="pb-4 text-gray-400 font-medium text-sm hover:text-[#002f34]">Збережені пошуки</button>
                        <button className="pb-4 text-gray-400 font-medium text-sm hover:text-[#002f34]">Нещодавно переглянуті</button>
                    </div>
                    <button
                        onClick={() => handleDeleteAllFavorite()}
                        className="border border-[#d2d9e1] bg-[#f3f6f9] text-[#3a546b] rounded-[6px] px-[18px] py-[10px] font-normal text-[16px] hover:bg-white transition-colors"
                    >
                        Очистити обрані
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {favorites.map((ad) => (
                        <div key={ad.id} className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm">
                            {/* Фото та інфо */}
                            <div className="p-3 flex flex-col gap-2 cursor-pointer" onClick={() => navigate(`/advertisement/${ad.id}`)}>
                                <div className="h-32 rounded-md overflow-hidden bg-gray-100">
                                    <img
                                        src={`${EnvConfig.API_URL}/images/advertisements/1200_${ad.images?.[0]}`}
                                        className="w-full h-full object-cover"
                                        alt={ad.name}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 truncate">{ad.name}</p>
                                <p className="text-sm font-bold text-[#002f34]">{ad.price.toLocaleString()} грн</p>
                            </div>

                            <div className="mt-auto border-t border-gray-100">
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/order/${ad.id}`);
                                }} className="w-full py-2.5 px-4 flex justify-between items-center text-blue-500 text-xs font-medium hover:bg-blue-50 border-b border-gray-100">
                                    Купити товар <RiArrowRightLine />
                                </button>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFavorite(ad.id);
                                }} className="w-full py-2.5 px-4 flex justify-between items-center text-red-500 text-xs font-medium hover:bg-red-50">
                                    Видалити товар <span className="text-lg">×</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {favorites.length === 0 && (
                    <div className="flex flex-col items-center mt-20 text-gray-400">
                        <div className="text-6xl mb-4"><IoStatsChart size={100}/></div>
                        <p className="text-lg">Тут порожньо :(</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;