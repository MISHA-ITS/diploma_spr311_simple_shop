import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { TreeSelect } from "antd";
import { TiDelete } from "react-icons/ti";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { toast } from "react-toastify";
import { useGetAllCategoriesQuery } from "../../../services/apiCategory.ts";
import { buildTree } from "../../Categories/utils/functions.ts";
import { ICategoryTreeNode } from "../../../types/Category/types.ts";
import AreasDropDown from "../../MainPage/AreasDropDown.tsx";
import { useGetAreaByIdQuery, useGetAreasQuery, useGetSettlementsQuery } from "../../../services/apiNewPost.ts";
import { useGetAdvertisementByIdQuery, useUpdateAdvertisementMutation } from "../../../services/apiAdvertisement.ts";
import EnvConfig from "../../../config/env.ts";
import { IArea, ISettlement } from "../../../models/newPost.ts";
import { useGetUserByIdQuery } from "../../../services/apiUser.ts";
import {useProfileQuery} from "../../../services/apiAccount.ts";

const EditAdvertisementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        categoryId: null as string | number | null,
        selectedSettlement: null as ISettlement | null,
        selectedArea: null as IArea | null,
        previews: [] as string[],
        images: [] as File[]
    });

    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const { data: adData, isSuccess: isAdLoaded, isLoading: isAdLoading } = useGetAdvertisementByIdQuery(Number(id));
    const { data: sellerData } = useGetUserByIdQuery(Number(adData?.payload?.userId) || 0, {
        skip: !isAdLoaded || !adData
    });
    const [updateAdvertisement, { isLoading: isUpdating }] = useUpdateAdvertisementMutation();

    const { data: areas } = useGetAreasQuery();
    const { data: settlements, isLoading: isSettlementsLoading } = useGetSettlementsQuery();
    const areaRef = adData?.payload?.settlement?.area;
    const { data: areaData } = useGetAreaByIdQuery(areaRef ?? "", { skip: !areaRef });
    const { data: allCategories } = useGetAllCategoriesQuery();
    const [categoryFilterData, setCategoryFilterData] = useState<{ categoryTree: ICategoryTreeNode[] }>({ categoryTree: [] });

    const { data: profileData } = useProfileQuery();
    const User = profileData?.payload;
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (isAdLoaded && adData?.payload && User) {
            // Перевіряємо, чи збігаються ID (приводимо до одного типу)
            if (String(adData.payload.userId) === String(User.id)) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                toast.error("Ви не можете редагувати чуже оголошення!");
                navigate(-1); // Викидаємо на головну
            }
        }
    }, [isAdLoaded, adData, User, navigate]);



    //tree
    useEffect(() => {
        const categories = allCategories?.payload ?? [];
        if (categories.length === 0) return;
        try {
            const tree = buildTree(
                categories,
                null,
            );
            setCategoryFilterData(prev => ({
                ...prev,
                categoryTree: tree,
            }));
        } catch (error) {
            console.error("Помилка побудови дерева:", error);
        }
    }, [allCategories]);

    useEffect(() => {
        if (isAdLoaded && adData?.payload) {
            const data = adData.payload;
            const serverPreviews = data.images?.map((img: string) =>
                `${EnvConfig.API_URL}/images/advertisements/1200_${img}`
            ) || [];

            updateFormData({
                title: data.name || "",
                description: data.description || "",
                price: String(data.price) || "",
                categoryId: data.categoryId,
                selectedSettlement: data.settlement ? {
                    ref: data.settlement.ref,
                    description: data.settlement.description,
                } as ISettlement : null,
                previews: serverPreviews,
                images: []
            });
        }
    }, [isAdLoaded, adData]);

    // Оновлення області
    useEffect(() => {
        if (areaData) {
            updateFormData({
                selectedArea: {
                    ref: areaData.ref,
                    description: areaData.description,
                    regionType: areaData.regionType
                } as IArea
            });
        }
    }, [areaData]);

    const isFormValid =
        formData.title.length < 14 ||
        formData.description.length < 30 ||
        formData.categoryId == null ||
        formData.selectedSettlement == null ||
        Number(formData.price) <= 0 ||
        formData.price?.toString().trim() === "" ||
        formData.previews.length === 0;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            updateFormData({
                images: [...formData.images, ...selectedFiles],
                previews: [...formData.previews, ...newPreviews]
            });
        }
    };

    const removeImage = (index: number) => {
        const urlToRemove = formData.previews[index];
        if (urlToRemove.startsWith('blob:')) {
            URL.revokeObjectURL(urlToRemove);
            const blobPreviews = formData.previews.filter(p => p.startsWith('blob:'));
            const blobIndex = blobPreviews.indexOf(urlToRemove);
            if (blobIndex !== -1) {
                const newImages = [...formData.images];
                newImages.splice(blobIndex, 1);
                updateFormData({ images: newImages });
            }
        }
        updateFormData({ previews: formData.previews.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("Id", String(id));
            data.append("Name", formData.title);
            data.append("Description", formData.description);
            data.append("Price", String(formData.price));
            data.append("CategoryId", String(formData.categoryId));

            if (formData.selectedSettlement?.ref) {
                data.append("SettlementRef", formData.selectedSettlement.ref);
            }

            formData.previews.forEach((url) => {
                if (!url.startsWith("blob:")) {
                    const fileName = url.split('/').pop()?.replace("1200_", "");
                    if (fileName) {
                        data.append("ExistingImages", fileName);
                    }
                }
            });

            formData.images.forEach((file) => {
                data.append("Images", file);
            });

            await updateAdvertisement(data).unwrap();
            toast.success("Оголошення оновлено!");
            navigate(`/advertisement/${id}`);
        } catch (error) {
            toast.error("Помилка при збереженні");
            console.error(error);
        }
    };
    if (isAdLoading || isAuthorized === null) {
        return <div className="text-center py-20">Перевірка доступу...</div>;
    }
    if (!isAdLoaded || !adData || !sellerData?.payload) return null;

    const seller = sellerData.payload;

    return (
        <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
            <button
                onClick={() => navigate(-1)}
                className="w-fit flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-4"
            >
                <RiArrowLeftSLine /> Назад
            </button>

            <h1 className="text-2xl font-bold text-center mb-8">Редагувати оголошення</h1>

            <section className="space-y-8">
                <h2 className="text-lg font-semibold">Опишіть у подробицях</h2>

                {/* Назва */}
                <div className="space-y-1 relative">
                    <label className="text-sm font-medium">Вкажіть назву*</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Назва"
                            value={formData.title}
                            onChange={(e) => updateFormData({ title: e.target.value })}
                            className={`w-full border-b-2 py-2 focus:border-blue-500 outline-none transition-colors bg-transparent ${
                                formData.title.length >= 14 ? "border-green-500" : "border-[#212121]"
                            }`}
                        />
                        {formData.title.length >= 14 && (
                            <span className="absolute right-0 top-2 text-green-600 font-bold animate-in fade-in duration-300">✓</span>
                        )}
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className={formData.title.length > 0 && formData.title.length < 14 ? "text-red-500" : "text-gray-500"}>
                            {"Назва має містити не менше 14 символів"}
                        </span>
                        <span className="text-gray-500">{formData.title.length}/60</span>
                    </div>
                </div>

                {/* Категорія */}
                <div className="space-y-1 relative">
                    <label className="text-sm font-medium">Категорія*</label>
                    <div className={`relative border-b-2 transition-colors ${formData.categoryId ? "border-green-500" : "border-[#212121]"}`}>
                        <TreeSelect
                            style={{ width: '100%', height: '50px' }}
                            value={formData.categoryId}
                            allowClear
                            showSearch
                            treeNodeFilterProp="title"
                            variant="borderless"
                            treeData={categoryFilterData.categoryTree}
                            placeholder={'Відсутня'}
                            onChange={(val) => updateFormData({ categoryId: val })}
                        />
                        {formData.categoryId && (
                            <span className="absolute right-0 top-3 text-green-600 font-bold animate-in fade-in duration-300">✓</span>
                        )}
                    </div>
                </div>

                {/* Фото */}
                <div className="space-y-3 relative">
                    <label className="text-sm font-medium flex justify-between items-center">
                        Фото*
                        {formData.previews.length > 0 && (
                            <span className="text-green-600 font-bold animate-in fade-in duration-300">✓</span>
                        )}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {formData.previews.length < 8 && (
                            <label className="aspect-square border-2 border-dashed border-amber-200 bg-amber-50 flex flex-col items-center justify-center cursor-pointer text-xs hover:bg-amber-100 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <span className="text-amber-800 font-medium">+ Додати фото</span>
                            </label>
                        )}

                        {formData.previews.map((url, index) => (
                            <div key={url} className="aspect-square relative group">
                                <img
                                    src={url}
                                    className="w-full h-full object-cover rounded-md border"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                    <TiDelete size={'100%'} />
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                                        Головне фото
                                    </div>
                                )}
                            </div>
                        ))}

                        {[...Array(Math.max(0, 7 - formData.previews.length))].map((_, i) => (
                            <div key={i} className="aspect-square bg-[#D1D1D1] flex items-center justify-center opacity-40 text-xl border rounded-md">
                                <MdOutlineInsertPhoto size={'30%'} />
                            </div>
                        ))}
                    </div>
                    <p className={`text-[10px] ${formData.previews.length === 0 ? "text-red-500" : "text-gray-400"}`}>
                        {formData.previews.length === 0
                            ? "Будь ласка, залиште або додайте хоча б одне фото"
                            : "Перше фото буде на обкладинці. Ви можете додати до 8 зображень."}
                    </p>
                </div>

                {/* Опис */}
                <div className="space-y-1 relative">
                    <label className="text-sm font-medium">Опис*</label>
                    <div className="relative">
                        <textarea
                            rows={6}
                            placeholder="Подумайте, що б ви хотіли дізнатись побачивши це оголошення..."
                            value={formData.description}
                            onChange={(e) => updateFormData({ description: e.target.value })}
                            className={`w-full border-2 p-3 rounded-md outline-none resize-none transition-colors ${
                                formData.description.length >= 30 ? "border-green-500" : "border-[#212121]"
                            }`}
                        />
                        {formData.description.length >= 30 && (
                            <span className="absolute right-3 top-3 text-green-600 font-bold animate-in fade-in duration-300">✓</span>
                        )}
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className={formData.description.length > 0 && formData.description.length < 30 ? "text-red-500" : "text-gray-500"}>
                            Внесіть сюди щонайменше 30 символів
                        </span>
                        <span className="text-gray-500">{formData.description.length}/10 000</span>
                    </div>
                </div>

                {/* Контактна інформація */}
                <div className="flex flex-col space-y-6 pt-4 max-w-md">

                    {/* Місцезнаходження */}
                    <div className="space-y-1 relative">
                        <label className="text-sm font-medium text-gray-600">Місцезнаходження*</label>
                        <div className="relative">
                            {areas && (
                                <AreasDropDown
                                    areas={areas}
                                    settlements={settlements!}
                                    isLoading={isSettlementsLoading}
                                    selectedArea={formData.selectedArea}
                                    selectedSettlement={formData.selectedSettlement}
                                    onSelectArea={(area) => updateFormData({ selectedArea: area, selectedSettlement: null })}
                                    onSelectSettlement={(settlement) => updateFormData({ selectedSettlement: settlement })}
                                />
                            )}
                            {formData.selectedSettlement && (
                                <span className="absolute right-0 top-2 text-green-600 font-bold animate-in fade-in duration-300">✓</span>
                            )}
                        </div>
                    </div>

                    {/* Номер телефону */}
                    <div className="space-y-1 border-b-2 border-[#212121] relative">
                        <label className="text-sm font-medium text-gray-600">
                            Номер телефону* <span className="text-xs font-normal text-gray-400">(щоб змінити номер телефону перейдіть у профіль)</span>
                        </label>
                        <input
                            type="tel"
                            readOnly={true}
                            value={seller.phoneNumber ?? ""}
                            className="w-full py-2 outline-none bg-transparent text-gray-800 cursor-not-allowed"
                        />
                        {seller.phoneNumber && (
                            <span className="absolute right-0 bottom-2 text-green-600 font-bold animate-in fade-in duration-300">✓</span>
                        )}
                    </div>

                    {/* Ціна */}
                    <div className="space-y-1 relative">
                        <label className="text-sm font-medium text-gray-600">Ціна <span className="text-xs font-normal text-gray-400">(грн)</span></label>
                        <div className={`relative border-b-2 transition-colors ${Number(formData.price) > 0 ? "border-green-500" : "border-[#212121]"}`}>
                            <input
                                type="number"
                                min="1"
                                placeholder="000"
                                value={formData.price ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    updateFormData({ price: val });
                                }}
                                className="w-full py-2 outline-none bg-transparent"
                            />
                            {Number(formData.price) > 0 && (
                                <span className="absolute right-5 bottom-2 text-green-600 font-bold animate-in fade-in duration-300">✓</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="flex justify-end gap-4 pt-10">
                    <button
                        onClick={handleSubmit}
                        disabled={isFormValid || isUpdating}
                        className="px-8 py-2 bg-[#212121] text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
                    >
                        {isUpdating ? "Збереження..." : "Зберегти зміни"}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default EditAdvertisementPage;