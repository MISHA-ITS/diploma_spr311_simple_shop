import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

import AdvertisementCard from "./AdvertisementCard.tsx";
import AdvertisementRow from "./AdvertisementRow.tsx";

import { IAdvertisement } from "../../types.ts";

import {
    useApproveMutation,
    useDeleteAdvertisementMutation,
    useGetAdvertisementsQuery, useToggleBlockMutation,
} from "../../../../services/apiAdvertisement.ts";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import {IAdvFilter} from "../../../AdvsPage/types.ts";

const AdvertisementsList: React.FC = () => {
    const [deleteAd] = useDeleteAdvertisementMutation();
    const [toggleBlockAd] = useToggleBlockMutation();
    const [approveAd] = useApproveMutation();

    // --- Оновлені фільтри  ---
    const [searchParams, setSearchParams] = useSearchParams();

    const sortByParam = searchParams.get("sortBy");
    const orderParam = searchParams.get("order");

    const [filters, setFilters] = useState<IAdvFilter>({
        categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null,
        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
        sortBy: sortByParam === "date" || sortByParam === "price" ? sortByParam : null,
        order: orderParam === "asc" || orderParam === "desc" ? orderParam : null,
        date: null,
        settlementRef: null,
        search: null,
        active: null,
        pageNumber: Number(searchParams.get("pageNumber") || 1),
        pageSize: Number(searchParams.get("pageSize") || 10),
    });

    // Відправляємо саме ці фільтри в API
    const { data, refetch } = useGetAdvertisementsQuery(filters);
    const advertisements = data?.payload?.items ?? [];
    const total = data?.payload?.totalCount ?? 0;

    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const toggleSearch = () => {
        if (isSearchVisible) {
            setFilters(prev => ({ ...prev, name: "" })); // очищуємо фільтр при закритті
        }
        setFilters(prev => ({ ...prev, pageNumber: 1 })); // скидаємо на 1 сторінку
        setIsSearchVisible(!isSearchVisible);
    };

    // Синхронізація URL
    useEffect(() => {
        const params: Record<string, string> = {};
        if (filters.search) params.name = filters.search;
        if (filters.categoryId) params.categoryId = String(filters.categoryId);
        if (filters.minPrice) params.minPrice = String(filters.minPrice);
        if (filters.maxPrice) params.maxPrice = String(filters.maxPrice);
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.order) params.order = filters.order;
        if (filters.date) params.date = filters.date;
        params.pageNumber = String(filters.pageNumber);
        params.pageSize = String(filters.pageSize);

        setSearchParams(params);
    }, [filters, setSearchParams]);



    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Ви впевнені?',
            text: "Оголошення буде видалено назавжди!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Так, видалити!',
            cancelButtonText: 'Скасувати',
            backdrop: false, // Прибирає затемнення фону
            allowOutsideClick: false, // Забороняє закривати вікно кліком повз нього (рекомендовано, якщо немає бекдропу)
        });

        if (result.isConfirmed) {
            try {
                await deleteAd(id).unwrap();
                refetch();
                toast.success("Успішно видалено!");
            } catch (error) {
                toast.error(`Помилка при видаленні. => ${error}`);
            }
        }
    };


    const handleToggleBlock = async (ad: IAdvertisement) => {
        try {
            await toggleBlockAd(ad.id).unwrap();

            toast.success(ad.isBlocked ? "Оголошення розблоковано" : "Оголошення заблоковано");
            refetch();
        } catch (error) {
            toast.error(`Помилка при зміні статусу => ${error}`);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await approveAd(id).unwrap();
            toast.success("Оголошення підтверджено");
            refetch();
        } catch (error) {
            toast.error(`Помилка при підтвердженні => ${error}`);
        }
    };

    return (
        <div className="relative w-full pb-24">
            <AdvertisementCard count={total} onRefresh={refetch}>
                <table className="min-w-full text-left">
                    <thead className="bg-blue-50/50 dark:bg-blue-900/10 text-xs uppercase text-blue-900/70 dark:text-blue-300">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-4 min-w-[300px]">
                            <div className="flex items-center justify-between gap-2">
                                {!isSearchVisible && (
                                    <span className="whitespace-nowrap">Назва</span>
                                )}

                                <div className={`flex items-center gap-2 transition-all duration-300 ${isSearchVisible ? "w-full" : "w-auto"}`}>
                                    {isSearchVisible && (
                                        <input
                                            autoFocus
                                            value={filters.search ?? ""}
                                            onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value, pageNumber: 1 }))}
                                            placeholder="Шукати оголошення..."
                                            className="w-full bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-900 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-normal normal-case text-gray-900 dark:text-gray-100"
                                        />
                                    )}

                                    <button
                                        onClick={toggleSearch}
                                        type="button"
                                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-500 transition-colors flex-shrink-0"
                                    >
                                        {isSearchVisible ? <HiXMark size={18} /> : <HiMagnifyingGlass size={18} />}
                                    </button>
                                </div>
                            </div>
                        </th>
                        <th className="px-4 py-2">Ціна</th>
                        <th className="px-4 py-2">Категорія</th>
                        <th className="px-4 py-2">Опис</th>
                        <th className="px-4 py-2 text-center">Дії</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {advertisements.map((ad: IAdvertisement) => (
                        <AdvertisementRow
                            key={ad.id}
                            advertisement={ad}
                            onDelete={handleDelete}
                            onToggleBlock={() => handleToggleBlock(ad)}
                            onApprove={() => handleApprove(ad.id)}
                        />
                    ))}
                    </tbody>
                </table>
            </AdvertisementCard>



            {/* Pagination */}
            <div className="mt-4 bg-white dark:bg-neutral-800 px-6 py-2 rounded-2xl shadow-sm border border-blue-50 dark:border-blue-700/30">
                <Pagination
                    align="center"
                    current={filters.pageNumber}
                    pageSize={filters.pageSize}
                    total={total}
                    showSizeChanger
                    locale={{ items_per_page: ' / На сторінку' }}
                    onChange={(pageNumber, pageSize) => setFilters(prev => ({ ...prev, pageNumber, pageSize }))}
                />
            </div>

            {/* Overlay
            {isDrawerOpen && <div className="fixed inset-0 bg-black/30 z-30" />}*/}

            <ToastContainer position="bottom-center" autoClose={3000} />
        </div>
    );
};

export default AdvertisementsList;