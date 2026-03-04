import * as React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import LocationIcon from "../../../icons/Location.png";
import AdvertisementGallery from "./AdvertisementGallery.tsx";
import {useAdForm} from "../../../context/AdvertisementContext.tsx";
import {toast} from "react-toastify";
import {useCreateAdvertisementMutation} from "../../../services/apiAdvertisement.ts";
import {useProfileQuery} from "../../../services/apiAccount.ts";
import EnvConfig from "../../../config/env.ts";

const AdvertisementPreview: React.FC = () => {
    const navigate = useNavigate();
    const { formData, clearForm } = useAdForm();
    const [createAdvertisement] = useCreateAdvertisementMutation();
    const { data:profile} = useProfileQuery();
    if (profile == null) {return}
    const author = profile.payload;

    const handleBack = () => {
        navigate("/createAdvertisement")
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();

            // Додаємо текстові поля
            data.append("Name", formData.title);
            data.append("Description", formData.description);
            data.append("Price", String(formData.price));
            data.append("CategoryId", String(formData.categoryId));
            data.append("SettlementRef", formData.selectedSettlement?.ref || "");

            if (formData.selectedSettlement?.ref) {
                data.append("SettlementRef", formData.selectedSettlement.ref);
            }

            // Додаємо файли зображень
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

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[1430px] px-4 py-8 flex flex-col gap-10">

                {/* BACK */}
                <button
                    onClick={() => navigate('/createAdvertisement')}
                    className="w-fit flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-4"
                >
                    <RiArrowLeftSLine /> Повернутись до редагування
                </button>

                {/* MAIN */}
                <div className="flex gap-8">
                    <div className="flex flex-col gap-4 flex-[2]">
                        <AdvertisementGallery images={formData.previews} />
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-4 flex-[1] ">

                        {/* PRICE */}
                        <div className="bg-[#E0E0E0]  rounded-lg p-6 flex flex-col gap-4">
                            <span className="text-xl font-semibold">
                                {formData.title}
                            </span>

                            <span className="text-2xl font-bold">
                                {formData.price} грн
                            </span>

                            <div className="h-11 px-4 rounded-md border border-gray-300 bg-white flex items-center justify-center text-[#6C6C6C]">
                                {author.phoneNumber || "Номер не вказано"}
                            </div>

                            <button className="h-11 bg-[#6C6C6C] text-white rounded-md cursor-not-allowed opacity-80">
                                Повідомлення
                            </button>
                        </div>

                        {/* SELLER */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6 flex gap-4">
                            <div className="w-12 h-12 bg-[#BDBDBD] rounded-full overflow-hidden">
                                <img
                                    className="w-full h-full object-cover" src={author?.image
                                    ? `${EnvConfig.API_URL}/images/users/1200_${author.image}`
                                    : `${EnvConfig.API_URL}/images/noimage.jpeg`
                                }
                                />
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold">{author?.lastName} {author?.firstName}</p>
                                <p className="text-[#555]">Професійний продавець</p>
                                <p className="text-[#555]">⭐ 5 років на сервісі</p>
                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="bg-[#E0E0E0] rounded-lg p-6 flex gap-2 text-sm">
                            <img src={LocationIcon} className="w-5 h-6" />
                            <span>
                                {formData.selectedArea && formData.selectedSettlement
                                    ? `${formData.selectedArea.description}, ${formData.selectedSettlement.description}`
                                    : "Місце не вказано"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col gap-3 max-w-[930px]">
                    <h3 className="text-xl font-semibold">
                        Опис від продавця
                    </h3>
                    <p className="text-[#333] whitespace-pre-wrap">
                        {formData.description}
                    </p>
                </div>

                {/* Кнопки */}
                <div className="border-t border-gray-200 pt-8 flex justify-end gap-4">
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 border border-gray-800 hover:bg-gray-100 transition-colors"
                    >
                        Редагувати
                    </button>
                    <button
                        className="px-10 py-2 bg-green-600 text-white font-bold hover:bg-green-700 transition-shadow shadow-md"
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