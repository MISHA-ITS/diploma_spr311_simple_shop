import React, { useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import EnvConfig from "../../../config/env.ts";

const AdvertisementGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [index, setIndex] = useState(0);

    if (images.length == 0) {
        return <div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center">Немає фото</div>;
    }

    const next = () => setIndex((i) => (
        i == images.length - 1 ? 0 : i + 1
    ));
    const prev = () => setIndex((i) => (
        i == 0 ? images.length - 1 : i - 1
    ));

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group">
            <img
                src={`${EnvConfig.API_URL}/images/advertisements/1200_${images[index]}`}
                className="w-full h-full object-contain"
                alt="Product"
            />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-0 top-0 bottom-0 px-3 bg-black/10 hover:bg-black/30 text-white transition-all flex items-center"
                    >
                        <RiArrowLeftSLine size={40} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-0 top-0 bottom-0 px-3 bg-black/10 hover:bg-black/30 text-white transition-all flex items-center"
                    >
                        <RiArrowRightSLine size={40} />
                    </button>
                </>
            )}

            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {index + 1} / {images.length}
            </div>
        </div>
    );
};

export default AdvertisementGallery;