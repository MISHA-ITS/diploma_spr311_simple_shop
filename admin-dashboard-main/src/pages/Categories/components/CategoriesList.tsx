import { useEffect, useState} from "react";
import axios from "axios";
import EnvConfig from "../../../config/env.ts";
import {ICategory, ICategoryTreeNode} from "../../../types/Category/types.ts";
import CategoriesCard from "./CategoriesCard.tsx";
import CategoryRow from "./CategoryRow.tsx";
import {Pagination, TreeSelect} from 'antd';
import {buildTree} from "../utils/functions.ts";
import { HiMiniXMark } from "react-icons/hi2";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';


import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

const CategoriesList: React.FC = () => {
    const [isDrawerOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [allCategories, setAllCategories] = useState<ICategory[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [parentId, setParentId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isParentSearchVisible, setIsParentSearchVisible] = useState(false);
    const [filters, setFilters] = useState({
        searchName: "",
        parentName: ""
    });
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

    const toggleSearch = () => {
        if (isSearchVisible) {
            setFilters(prev => ({ ...prev, searchName: "" }));
        }
        setPage(1)
        setIsSearchVisible(!isSearchVisible);
    };

    const toggleParentSearch = () => {
        if (isParentSearchVisible) {
            setFilters(prev => ({ ...prev, parentName: "" }));
        }
        setPage(1)
        setIsParentSearchVisible(!isParentSearchVisible);
    };

    const closeDrawer = () => {
        setIsOpen(false);
        setSelectedCategory(null);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const loadAllCategories = async () => {
        try {
            const resp = await axios.get(
                `${EnvConfig.API_URL}/api/Category/list`
            );

            setAllCategories(resp.data.payload ?? []);
        } catch (err) {
            console.error("Помилка завантаження всіх категорій:", err);
        }
    };

    const refreshCategories = async () => {
        try {
            const resp = await axios.get(`${EnvConfig.API_URL}/api/Category/page`,
                {
                    params:{
                        page,
                        size:pageSize,
                        searchName: filters.searchName,
                        parentName: filters.parentName
                    }
                });
            setCategories(resp.data.payload.items ?? []);
            setTotal(resp.data.payload.total ?? 0);
        } catch (err) {
            console.error("Помилка при оновленні списку виникла помилка:", err);
        }
    };

    useEffect(() => {
        refreshCategories();
    }, [page, pageSize, filters]);

    useEffect(() => {
        loadAllCategories();
    }, []);

    useEffect(() => {
        if (!categories.length) return;

        const tree = buildTree(
            allCategories,
            null,
            selectedCategory ? [selectedCategory.id] : []
        );

        setCategoryFilterData(prev => ({
            ...prev,
            categoryTree: tree,
        }));
    }, [allCategories, selectedCategory]);

    //скрол
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isDrawerOpen]);

    const handleEditCategory = (category: ICategory) => {
        setSelectedCategory(category);
        setParentId(category.parentId);
        setName(category.name);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleCreateCategory = () => {
        setSelectedCategory(null);
        setName("");
        setParentId(null);
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsOpen(true);
    };

    const handleDeleteCategory = async (categoryId: number) => {
        const result = await Swal.fire({
            title: 'Ви впевнені?',
            text: "Цю дію неможливо буде скасувати!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Так, видалити!',
            cancelButtonText: 'Скасувати',
            backdrop: false
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${EnvConfig.API_URL}/api/Category/Delete/${categoryId}`, {
                    params: { id: categoryId }
                });

                setCategories(prev => prev.filter(c => c.id !== categoryId));

                toast.success("Категорію успішно видалено!");
            } catch (error) {
                console.error(error);
                toast.error("Помилка при видаленні категорії.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        //preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("Name", name);
            formData.append("ParentId", String(parentId ?? ""));


            if (selectedFile) {
                formData.append("Image", selectedFile);
            }

            if (selectedCategory) {
                formData.append("Id", String(selectedCategory.id));
                await axios.put(`${EnvConfig.API_URL}/api/Category/update`, formData);
            } else {
                await axios.post(`${EnvConfig.API_URL}/api/Category/create`, formData);
            }

            await refreshCategories()
            await loadAllCategories();
            closeDrawer()
            toast.success(selectedCategory ? "Категорія оновлена" : "Категорія створена");

        } catch (error) {
            console.error(error);
            toast.error(selectedCategory ? "Помилка при оновлені" : "Помилка при створені");
        }
    };

    return (
        <div className="relative w-full pb-24">

            <CategoriesCard count={total} onCreate={handleCreateCategory} onRefresh={refreshCategories}>
                <table className="min-w-full text-left">
                    <thead className="bg-blue-50/50 dark:bg-blue-900/10 text-xs uppercase text-blue-900/70 dark:text-blue-300">
                        <tr>
                            <th className="px-4 py-2">ID</th>

                            <th className="px-4 py-4 min-w-[200px]">
                                <div className="flex items-center justify-between group">
                                    <span className={isSearchVisible ? "hidden" : "block"}>Назва</span>

                                    <div className={`flex items-center gap-2 transition-all duration-300 ${isSearchVisible ? "w-full" : "w-auto"}`}>
                                        {isSearchVisible && (
                                            <input
                                                autoFocus
                                                value={filters.searchName}
                                                onChange={(e) => setFilters(prev => ({ ...prev, searchName: e.target.value }))}
                                                placeholder="Шукати..."
                                                className="w-full bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-900 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        )}
                                        <button
                                            onClick={toggleSearch}
                                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-500 transition-colors"
                                        >
                                            {isSearchVisible ? <HiXMark size={18} /> : <HiMagnifyingGlass size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </th>

                            <th className="px-4 py-4 min-w-[250px]">
                                <div className="flex items-center justify-between">
                                    <span className={isParentSearchVisible ? "hidden" : "block"}>Батьківська</span>

                                    <div className={`flex items-center gap-2 transition-all duration-300 ${isParentSearchVisible ? "w-full" : "w-auto"}`}>
                                        {isParentSearchVisible && (
                                            <input
                                                autoFocus
                                                value={filters.parentName}
                                                onChange={(e) => setFilters(prev => ({ ...prev, parentName: e.target.value }))}
                                                placeholder="Пошук батьківської..."
                                                className="w-full bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-900 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        )}
                                        <button
                                            onClick={toggleParentSearch}
                                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-500 transition-colors"
                                        >
                                            {isParentSearchVisible ? <HiXMark size={18} /> : <HiMagnifyingGlass size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </th>

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

            {/*Pagination*/}
            <div className="bg-white dark:bg-neutral-800 px-6 py-2 rounded-2xl shadow-sm border border-blue-50 dark:border-blue-700/30">
                <Pagination
                    align="center"
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger
                    onChange={(newPage, newSize) => {
                        setPage(newPage);
                        setPageSize(newSize);
                    }}
                />
            </div>

            {/* Overlay  */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 transition-opacity duration-300"
                    onClick={() => {
                        closeDrawer()
                    }}
                />
            )}

            {/* Drawer edit category*/}
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
                        onClick={() => closeDrawer()}
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
                            value={name}
                            onChange={(e) =>{
                                setName(e.target.value);}}
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
                            {selectedCategory ? 'Зберегти зміни' : 'Створити'}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default CategoriesList;
