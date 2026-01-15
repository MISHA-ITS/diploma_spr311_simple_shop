import { useEffect, useState } from "react";
import axios from "axios";
import EnvConfig from "../../../config/env.ts";
import {ICategory, ICategoryTreeNode} from "../../../types/Category/types.ts";
import CategoriesCard from "./CategoriesCard.tsx";
import CategoryRow from "./CategoryRow.tsx";
import { TreeSelect } from 'antd';
import {buildTree} from "../utils/funct.ts";
import { HiMiniXMark } from "react-icons/hi2";


const urlCategories = `${EnvConfig.API_URL}/api/Category/list`;

const CategoriesList: React.FC = () => {
    const [isDrawerOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [parentId, setParentId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [categoryFilterData, setCategoryFilterData] = useState<{
        categoryTree: ICategoryTreeNode[];
        excludedFilters: number[];
    }>({
        categoryTree: [],
        excludedFilters: [],
    });

    const onParentCategoryChange = (value: number | null) => {
        setParentId(value);
    };

    const closeDrawer = () => {
        setIsOpen(false);
        setSelectedCategory(null);
        setParentId(null);
        setSelectedFile(null);
        setPreviewUrl(null);
    };


    useEffect(() => {
        axios.get(urlCategories)
            .then(resp => {
                console.log("Categories API:", resp.data);
                setCategories(resp.data.payload);
            })
            .catch(err => {
                console.error("Categories error", err);
            });
    }, []);

    useEffect(() => {
        if (!categories.length) return;

        // Передаємо null як другий аргумент для пошуку кореневих елементів
        const tree = buildTree(
            categories,
            null,
            selectedCategory ? [selectedCategory.id] : []
        );

        setCategoryFilterData(prev => ({
            ...prev,
            categoryTree: tree,
        }));
    }, [categories, selectedCategory]);

    useEffect(() => {
        if (isDrawerOpen) {
            // Блокуємо скрол
            document.body.style.overflow = 'hidden';
        } else {
            // Повертаємо скрол
            document.body.style.overflow = 'auto';
        }

        // Чистимо ефект, якщо компонент видаляється
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isDrawerOpen]);

    const handleEditCategory = (category: ICategory) => {
        setSelectedCategory(category);
        setParentId(category.parentId);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleDeleteCategory = async (categoryId: number) => {
        if (!confirm("Ви впевнені, що хочете видалити категорію?")) return;
        const resp = await axios.delete(`${EnvConfig.API_URL}/api/Category/Delete/${categoryId}`, {
            params: { id: categoryId }
        });

        if (resp.status === 200 || resp.data.isSuccess) {
            setCategories(
                prev => prev.filter(c => c.id !== categoryId)
            );
            // alert("Категорію видалено");
        }
    };

    //Не дороблено
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        // робимо preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;

        try {
            const formData = new FormData();
            formData.append("Id", String(selectedCategory.id));
            formData.append("Name", name);
            formData.append("ParentId", String(parentId ?? ""));


            if (selectedFile) {
                formData.append("Image", selectedFile);
            }

            const { data } = await axios.put(
                `${EnvConfig.API_URL}/api/Category/update`,
                formData
            );
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            setCategories(prev =>
                prev.map(c =>
                    c.id === data.id ? data : c
                )
            );
            closeDrawer()

            //Змініти на react toastify
            alert("Збережено ");

        } catch (error) {
            console.error(error);
            //Змініти на react toastify
            alert("Помилка при оновленні");
        }
    };

    return (
        <div className="w-full">

            <CategoriesCard count={categories.length}>
                <table className="min-w-full text-left">
                    <thead className="bg-neutral-50 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Назва</th>
                        <th className="px-4 py-2">Батьківська категорія</th>
                        <th className="px-4 py-2">Дочірні категорії</th>
                        <th className="px-4 py-2 text-center">Дії</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {categories.map(c => (
                        <CategoryRow
                            key={c.id}
                            category={c}
                            onDeleteCategory={handleDeleteCategory}
                            onEditCategory={handleEditCategory}
                        />
                    ))}
                    </tbody>
                </table>
            </CategoriesCard>

            {/* Оверлей */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 transition-opacity duration-300"
                    onClick={() => {
                        closeDrawer()
                    }}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-96 border-l shadow-2xl ${
                isDrawerOpen ? "translate-x-0" : "translate-x-full"}
                top-[64px] 
                h-[calc(100vh-64px)] 
                p-4 overflow-y-auto`
            }>
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h5 className="text-lg font-semibold text-gray-700">
                        {selectedCategory ? 'Редагувати категорію' : 'Створити категорію'}
                    </h5>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg p-2 transition-colors">
                        <HiMiniXMark />
                    </button>
                </div>

                <form onSubmit={handleSubmitEdit} className="space-y-5">
                    <div className="flex flex-col items-center mb-6">
                        <span className="w-full text-center mb-2 text-sm font-medium text-gray-700">Зображення</span>

                        <label className="relative cursor-pointer group">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                hidden
                                onChange={handleFileChange}/>

                            <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm group-hover:border-blue-400 transition-all">
                                <img
                                    src={
                                        previewUrl ||
                                        (selectedCategory?.imageUrl
                                            ? `${EnvConfig.API_URL}/images/200_${selectedCategory.imageUrl}`
                                            : `${EnvConfig.API_URL}/images/noimage.jpeg`)
                                    }
                                    className="w-full h-full object-cover"
                                    alt="Категорія"/>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">
                                    Змінити
                                </span>
                            </div>
                        </label>

                        <p className="mt-2 text-[10px] text-gray-400">Натисніть на фото, щоб оновити</p>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Назва</label>
                        <input
                            type="text"
                            defaultValue={selectedCategory?.name || ''}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введіть назву..."
                        />
                    </div>

                    <label className="block mb-2 text-sm font-medium text-gray-900">Батьківська категорія</label>
                    <TreeSelect
                        style={{ width: '100%' }}
                        value={parentId}
                        allowClear
                        showSearch
                        size="small"
                        className="flex-1"
                        treeData={categoryFilterData.categoryTree}
                        placeholder={selectedCategory?.parentId || 'Відсутня'}
                        onChange={onParentCategoryChange}
                    />

                    <div className="pt-4">
                        <button className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-3 transition-colors shadow-md">
                            Зберегти зміни
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoriesList;
