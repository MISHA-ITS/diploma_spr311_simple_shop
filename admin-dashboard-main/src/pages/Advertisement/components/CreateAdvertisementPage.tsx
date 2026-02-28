import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {RiArrowLeftSLine} from "react-icons/ri";
import {TreeSelect} from "antd";
import {useGetAllCategoriesQuery} from "../../../services/apiCategory.ts";
import {buildTree} from "../../Categories/utils/functions.ts";
import {ICategoryTreeNode} from "../../../types/Category/types.ts";
import {TiDelete} from "react-icons/ti";
import {MdOutlineInsertPhoto} from "react-icons/md";
import AreasDropDown from "../../MainPage/AreasDropDown.tsx";
import {useGetAreasQuery, useGetSettlementsQuery} from "../../../services/apiNewPost.ts";
import {useAdForm} from "../../../context/AdvertisementContext.tsx";
import {useCreateAdvertisementMutation} from "../../../services/apiAdvertisement.ts";
import {toast} from "react-toastify";

const CreateAdvertisementPage: React.FC = () => {
    const navigate = useNavigate();
    const [createAdvertisement] = useCreateAdvertisementMutation();
    const { data: areas } = useGetAreasQuery();
    const {data: settlements, isLoading } = useGetSettlementsQuery();
    const { formData, clearForm, updateFormData } = useAdForm();
    const [categoryFilterData, setCategoryFilterData] = useState<{
        categoryTree: ICategoryTreeNode[];
        excludedFilters: number[];
    }>({
        categoryTree: [],
        excludedFilters: [],
    });
    const { data: allCategories  } = useGetAllCategoriesQuery();

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
        URL.revokeObjectURL(formData.previews[index]);

        updateFormData({
            images: formData.images.filter((_, i) => i !== index),
            previews: formData.previews.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.title.length < 14 || formData.description.length < 30 || !formData.categoryId || !formData.selectedSettlement) {
            return;
        }
        try {
            const data = new FormData();
            data.append("Name", formData.title);
            data.append("Description", formData.description);
            data.append("Price", formData.price.toString());
            data.append("Phone", formData.phone);
            data.append("CategoryId", String(formData.categoryId));
            data.append("SettlementRef", formData.selectedSettlement.ref);

            if (formData.images.length > 0) {
                formData.images.forEach((file) => {
                    data.append("Images", file);
                });
            }

            await createAdvertisement(data).unwrap();
            toast.success("Оголошення успішно опубліковано!");
            clearForm();
            navigate("/");
        } catch (error) {
            console.error("Помилка публікації:", error);
            toast.error("Не вдалося опублікувати оголошення");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
            <button
                onClick={() => navigate("/")}
                className="w-fit flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-4"
            >
                <RiArrowLeftSLine /> Повернутись до покупок
            </button>

            <h1 className="text-2xl font-bold text-center mb-8">Створити оголошення</h1>

            <section className="space-y-8">
                <h2 className="text-lg font-semibold">Опишіть у подробицях</h2>

                {/* Назва */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Вкажіть назву*</label>
                    <input
                        type="text"
                        placeholder="Назва"
                        value={formData.title}
                        onChange={(e) => updateFormData({ title: e.target.value })}
                        className="w-full border-b-2 border-[#212121] py-2 focus:border-blue-500 outline-none transition-colors bg-transparent"
                    />
                    <div className="flex justify-between text-xs">
                        <span className={formData.title.length > 0 && formData.title.length < 14 ? "text-red-500" : "text-gray-500"}>
                            {formData.title.length < 14 ? "Назва має містити не менше 14 символів" : "Назва валідна"}
                        </span>
                        <span className="text-gray-500">{formData.title.length}/60</span>
                    </div>
                </div>

                {/* Категорія */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Категорія*</label>
                    <div className="border-b-2 border-[#212121]">
                        <TreeSelect
                            style={{width: '100%', height: '50px'}}
                            value={formData.categoryId}
                            allowClear
                            showSearch
                            treeNodeFilterProp="title"
                            size="small"
                            variant="borderless"
                            className="flex-1"
                            treeData={categoryFilterData.categoryTree}
                            placeholder={'Відсутня'}
                            onChange={(val) => updateFormData({ categoryId: val })}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium">Фото*</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                        {/* Кнопка "Додати фото" */}
                        {formData.images.length < 8 && (
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

                        {/* Відображення прев'ю */}
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
                    <p className="text-[10px] text-gray-400">
                        Перше фото буде на обкладинці. Ви можете додати до 8 зображень.
                    </p>
                </div>

                {/* Опис */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Опис*</label>
                    <textarea
                        rows={6}
                        placeholder="Подумайте, що б ви хотіли дізнатись побачивши це оголошення. І додайте сюди"
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        className={`w-full border-2 p-3 rounded-md outline-none resize-none transition-colors ${
                            formData.description.length > 0 && formData.description.length < 30 ? "border-red-500" : "border-[#212121]"
                        }`}
                    />
                    <div className="flex justify-between text-xs">
                        <span
                            className={formData.description.length > 0 && formData.description.length < 30 ? "text-red-500" : "text-gray-500"}>
                            Внесіть сюди щонайменше 30 символів
                        </span>
                        <span className="text-gray-500">{formData.description.length}/10 000</span>
                    </div>
                </div>

                {/* Контактна інформація */}
                <div className="flex flex-col space-y-6 pt-4 max-w-md">

                    {/* Місцезнаходження */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">Місцезнаходження*</label>
                        {areas && (
                            <AreasDropDown
                                areas={areas}
                                settlements={settlements!}
                                isLoading={isLoading}
                                selectedArea={formData.selectedArea}
                                selectedSettlement={formData.selectedSettlement}
                                onSelectArea={(area) => updateFormData({ selectedArea: area, selectedSettlement: null })}
                                onSelectSettlement={(settlement) => updateFormData({ selectedSettlement: settlement })}
                            />
                        )}
                    </div>

                    {/* Номер телефону */}
                    <div className="space-y-1 border-b-2 border-[#212121]">
                        <label className="text-sm font-medium text-gray-600">Номер телефону*</label>
                        <input
                            type="tel"
                            placeholder="098 000 00 00"
                            value={formData.phone}
                            onChange={(e) => updateFormData({phone: e.target.value})}
                            className="w-full py-2 outline-none bg-transparent"
                        />
                    </div>

                    {/* Ціна */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-600">Ціна</label>
                        <div className="flex items-center border-b-2 border-[#212121]">
                            <input
                                type="number"
                                min="1"
                                placeholder="000"
                                value={formData.price}
                                onChange={(e) => updateFormData({ price: e.target.value })}
                                className="w-full py-2 outline-none bg-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Кнопки */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10">
                    <button onClick={() => navigate("/advertpreview")} disabled={formData.title.length < 14 || formData.description.length < 30} className="px-6 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                        Попередній перегляд
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={formData.title.length < 14 || formData.description.length < 30}
                        className="px-8 py-2 bg-[#212121] text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
                    >
                        Опублікувати
                    </button>
                </div>
            </section>
        </div>
    );
};

export default CreateAdvertisementPage;