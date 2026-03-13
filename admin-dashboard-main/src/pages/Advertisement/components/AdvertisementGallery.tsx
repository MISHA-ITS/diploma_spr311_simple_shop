import React, { useEffect, useState } from 'react';
import EnvConfig from "../../../config/env.ts";
import { IAdvertisementImage } from "../types.ts";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const AdvertisementGallery: React.FC<{ images: IAdvertisementImage[]; }> = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    // Встановлюємо початкове фото (головне або перше)
    useEffect(() => {
        if (images && images.length > 0) {
            const mainIdx = images.findIndex(img => img.isMain);
            setActiveIndex(mainIdx !== -1 ? mainIdx : 0);
        }
    }, [images]);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200">
                Немає фото
            </div>
        );
    }

    const activeImageUrl = `${EnvConfig.API_URL}/images/advertisements/1200_${images[activeIndex].imageUrl}`;

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="flex flex-col gap-4">
            {/* ВЕЛИКИЙ БЛОК ГАЛЕРЕЇ */}
            <div className="relative w-full h-[500px] overflow-hidden rounded-xl bg-black flex items-center justify-center group shadow-lg">

                {/* 1. ЗАБЛЮРЕНИЙ ФОН (щоб заповнити пусті місця з боків) */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110 transition-all duration-700 ease-in-out"
                    style={{ backgroundImage: `url(${activeImageUrl})` }}
                />

                {/* 2. ЧІТКЕ ФОТО (object-contain гарантує, що фото не обріжеться) */}
                <img
                    src={activeImageUrl}
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl transition-all duration-500 ease-in-out"
                    alt="Product active view"
                />

                {/* 3. ВЕЛИКІ ЗОНИ КЛІКУ (Стрілочки на всю висоту) */}
                {images.length > 1 && (
                    <>
                        {/* Ліва кнопка */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-0 top-0 z-30 w-1/5 h-full flex items-center justify-start text-white/40 hover:text-white transition-all duration-300 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100"
                        >
                            <RiArrowLeftSLine size={80} className="ml-2 drop-shadow-md" />
                        </button>

                        {/* Права кнопка */}
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-0 z-30 w-1/5 h-full flex items-center justify-end text-white/40 hover:text-white transition-all duration-300 bg-gradient-to-l from-black/40 to-transparent opacity-0 group-hover:opacity-100"
                        >
                            <RiArrowRightSLine size={80} className="mr-2 drop-shadow-md" />
                        </button>
                    </>
                )}

                {/* ІНДИКАТОР КІЛЬКОСТІ (Опціонально) */}
                <div className="absolute bottom-4 right-6 z-40 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md border border-white/10">
                    {activeIndex + 1} / {images.length}
                </div>
            </div>

            {/* МІНІАТЮРИ */}
            <div className="flex pl-2 gap-3 overflow-x-auto pb-2 scrollbar-hide pt-1">
                {images.map((img, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`min-w-[85px] h-[85px] cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 flex-shrink-0 ${
                            activeIndex === index
                                ? 'border-[#212121] scale-105 shadow-md opacity-100'
                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
                        }`}
                    >
                        <img
                            src={`${EnvConfig.API_URL}/images/advertisements/200_${img.imageUrl}`}
                            className="w-full h-full object-cover"
                            alt={`Thumbnail ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdvertisementGallery;