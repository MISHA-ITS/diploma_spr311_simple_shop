import * as React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import LocationIcon from "../../../icons/Location.png";
import AdvertisementGallery from "./AdvertisementGallery.tsx";
import { useAdForm } from "../../../context/AdvertisementContext.tsx";
import { toast } from "react-toastify";
import { useCreateAdvertisementMutation } from "../../../services/apiAdvertisement.ts";
import { useProfileQuery } from "../../../services/apiAccount.ts";
import EnvConfig from "../../../config/env.ts";
import { FaRegHeart } from "react-icons/fa";

const AdvertisementPreview: React.FC = () => {
    const navigate = useNavigate();
    const { formData, clearForm } = useAdForm();
    const [createAdvertisement] = useCreateAdvertisementMutation();
    const { data: profile } = useProfileQuery();

    if (profile == null) return null;
    const author = profile.payload;

    const handleBack = () => {
        navigate("/createAdvertisement")
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();

            data.append("Name", formData.title);
            data.append("Description", formData.description);
            data.append("Price", String(formData.price));
            data.append("CategoryId", String(formData.categoryId));

            if (formData.selectedSettlement?.ref) {
                data.append("SettlementRef", formData.selectedSettlement.ref);
            }

            if (formData.images.length > 0) {
                formData.images.forEach((file: File) => {
                    data.append("Images", file);
                });
            }

            await createAdvertisement(data).unwrap();
            clearForm();
            toast.success("Оголошення успішно опубліковано!");
            navigate("/");

        } catch (error) {
            console.error("Помилка публікації:", error);
            toast.error("Не вдалося опублікувати оголошення");
        }
    };

    //fix картинок
    const mappedImages = formData.previews.map((url, index) => ({
        imageUrl: url,
        isMain: index === 0
    }));

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[1430px] px-4 py-8 flex flex-col gap-10">

                {/* BACK BUTTON */}
                <button
                    onClick={handleBack}
                    className="w-fit flex items-center text-sm text-gray-600 hover:text-black transition-colors"
                >
                    <RiArrowLeftSLine /> Повернутись до редагування
                </button>

                {/* MAIN CONTENT */}
                <div className="flex gap-8">
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-6 flex-[2]">
                        <AdvertisementGallery images={mappedImages} />

                        {/* DESCRIPTION */}
                        <div className="flex flex-col gap-3 mt-4 max-w-[930px]">
                            <h3 className="text-xl font-semibold text-[#002f34]">
                                Опис від продавця
                            </h3>
                            <p className="text-[#333] whitespace-pre-wrap leading-relaxed">
                                {formData.description}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-4 flex-[1]">
                        {/* PRICE BOX */}
                        <div className="bg-[#dae5f9] rounded-lg p-6 flex flex-col gap-4 relative">
                            <div className="absolute top-6 right-6 flex items-center gap-4">
                                <div className="opacity-30"><FaRegHeart size={30} color="#002f34" /></div>
                            </div>

                            <span className="text-2xl font-medium text-[#002f34] pr-14 break-words leading-tight">
                                {formData.title || "Назва оголошення"}
                            </span>

                            <span className="text-3xl font-bold text-[#002f34]">
                                {formData.price.toLocaleString()} грн
                            </span>

                            <button disabled className="h-12 bg-[#5d87db] text-white rounded-md flex items-center justify-center font-bold opacity-70 cursor-not-allowed text-lg">
                                Купити
                            </button>

                            <div className="h-12 px-4 rounded-md bg-white flex items-center justify-center text-[#002f34] font-medium text-lg border border-[#dae5f9]">
                                {author?.phoneNumber || "Номер приховано"}
                            </div>
                        </div>

                        {/* SELLER BOX */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6 flex gap-4 items-center">
                            <div className="w-12 h-12 bg-[#BDBDBD] rounded-full overflow-hidden flex-shrink-0">
                                <img
                                    className="w-full h-full object-cover"
                                    src={author?.image
                                        ? `${EnvConfig.API_URL}/images/users/1200_${author.image}`
                                        : `${EnvConfig.API_URL}/images/noimage.jpeg`
                                    }
                                    alt="Seller"
                                />
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-[#002f34]">{author?.lastName} {author?.firstName}</p>
                                <p className="text-[#555]">Професійний продавець</p>
                            </div>
                        </div>

                        {/* LOCATION BOX */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6">
                            <h3 className="text-xl font-bold text-[#002f34] mb-4">
                                Місцезнаходження
                            </h3>
                            <div className="flex gap-4 items-start">
                                <img src={LocationIcon} className="w-5 h-6 opacity-80 mt-1" alt="location" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-[#002f34]">
                                        {formData.selectedSettlement?.description || "Місто не вказано"}
                                    </span>
                                    <span className="text-[#406367] text-md">
                                        {formData.selectedArea?.description ? `${formData.selectedArea.description} область` : "Область не вказана"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM BUTTONS */}
                <div className="border-t border-gray-200 pt-8 mt-4 flex justify-end gap-4">
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 border border-gray-800 hover:bg-gray-100 transition-colors font-medium rounded"
                    >
                        Редагувати
                    </button>
                    <button
                        className="px-10 py-2 bg-[#212121] text-white rounded font-medium hover:bg-black transition-colors shadow-sm"
                        onClick={handleSubmit}
                    >
                        Опублікувати
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvertisementPreview;