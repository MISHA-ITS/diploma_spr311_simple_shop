import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';
import EnvConfig from "../../config/env.ts";
import {
    useProfileQuery,
    useRemoveAllFromFavoritesMutation,
    useRemoveFromFavoritesMutation
} from "../../services/apiAccount.ts";
import { IoStatsChart } from "react-icons/io5";
import { IAdvertisement } from "../Advertisement/types.ts";

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>('favorites');
    const [recentViewed, setRecentViewed] = useState<IAdvertisement[]>([]);

    const { data: userData, isLoading } = useProfileQuery();
    const favorites = userData?.payload?.favoriteAdverts || [];
    const [removeFromFavorites] = useRemoveFromFavoritesMutation();
    const [removeAllFavorites] = useRemoveAllFromFavoritesMutation();

    useEffect(() => {
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
            setRecentViewed(JSON.parse(stored));
        }
    }, []);

    if (isLoading) return <div className="p-10 text-center text-[#002f34] font-medium">Завантаження...</div>;

    const handleDeleteFavorite = async (id: number) => {
        try {
            await removeFromFavorites(id).unwrap();
        } catch (error) { console.error(error); }
    };

    const handleDeleteAllFavorite = async () => {
        try {
            await removeAllFavorites().unwrap();
        } catch (error) { console.error(error); }
    };

    const handleDeleteRecent = () => {
        localStorage.removeItem('recentlyViewed');
        setRecentViewed([]);
    };

    const displayItems = activeTab == 'favorites' ? favorites : recentViewed;

    return (
        <div className="w-full bg-[#f2f4f5] min-h-screen pb-20">
            <div className="max-w-[1250px] mx-auto px-4 pt-10">
                <h1 className="text-3xl font-bold text-[#002f34] text-center mb-10">Обрані</h1>

                {/* TABS HEADER */}
                <div className="flex justify-between items-center border-b border-gray-200 mb-8 min-h-[62px]">
                    <div className="flex gap-10">
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`pb-4 font-medium text-sm transition-all ${activeTab == 'favorites' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-[#002f34]'}`}
                        >
                            Вибрані оголошення
                        </button>
                        <button
                            onClick={() => setActiveTab('recent')}
                            className={`pb-4 font-medium text-sm transition-all ${activeTab == 'recent' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-[#002f34]'}`}
                        >
                            Нещодавно переглянуті
                        </button>
                    </div>

                    <div className="pb-4">
                        {activeTab == 'favorites' && favorites.length > 0 ? (
                            <button
                                onClick={handleDeleteAllFavorite}
                                className="border border-[#d2d9e1] bg-[#f3f6f9] text-[#3a546b] rounded-[6px] px-[18px] py-[10px] font-normal text-[16px] hover:bg-white transition-colors"
                            >
                                Очистити обрані
                            </button>
                        ) : activeTab == 'recent' && recentViewed.length > 0 ? (
                            <button
                                onClick={handleDeleteRecent}
                                className="border border-[#d2d9e1] bg-[#f3f6f9] text-[#3a546b] rounded-[6px] px-[18px] py-[10px] font-normal text-[16px] hover:bg-white transition-colors"
                            >
                                Очистити переглянуті
                            </button>
                        ) : (
                            <div className="h-[46px]" />
                        )}
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {displayItems.map((ad) => {
                        const mainImgUrl = ad.images?.find(img => img.isMain)?.imageUrl || ad.images?.[0]?.imageUrl;

                        return (
                            <div key={ad.id} className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                                <div
                                    className="p-3 flex flex-col gap-2 cursor-pointer"
                                    onClick={() => navigate(`/advertisement/${ad.id}`)}
                                >
                                    <div className="h-32 rounded-md overflow-hidden bg-gray-100">
                                        {mainImgUrl ? (
                                            <img
                                                src={`${EnvConfig.API_URL}/images/advertisements/1200_${mainImgUrl}`}
                                                className="w-full h-full object-cover"
                                                alt={ad.name}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">Немає фото</div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate font-medium">{ad.name}</p>
                                    <p className="text-sm font-bold text-[#002f34]">{ad.price.toLocaleString()} грн</p>
                                </div>

                                <div className="mt-auto border-t border-gray-100">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/order/${ad.id}`); }}
                                        className="w-full py-2.5 px-4 flex justify-between items-center text-blue-500 text-xs font-medium hover:bg-blue-50 border-b border-gray-100 transition-colors"
                                    >
                                        Купити товар <RiArrowRightLine />
                                    </button>

                                    {activeTab == 'favorites' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteFavorite(ad.id); }}
                                            className="w-full py-2.5 px-4 flex justify-between items-center text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
                                        >
                                            Видалити товар <span className="text-lg">×</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {((activeTab === 'favorites' && favorites.length === 0) ||
                    (activeTab === 'recent' && recentViewed.length === 0)) && (
                    <div className="flex flex-col items-center mt-20 text-gray-400">
                        <div className="text-6xl mb-4"><IoStatsChart size={100} /></div>
                        <p className="text-lg">Тут порожньо :(</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;