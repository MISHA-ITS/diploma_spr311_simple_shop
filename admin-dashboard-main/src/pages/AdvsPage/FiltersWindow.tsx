import {FC, useEffect, useState} from "react";
import {useGetCategoriesWithCountsQuery} from "../../services/apiCategory.ts";
import CategoryFilterItem from "./CategoryFilterItem.tsx";
import {IAdvFilter, UpdateOptions} from "./types.ts";
import {Checkbox} from "antd";
import Loader from "../../components/Loader.tsx";

type FiltersWindowProps = {
    filter: IAdvFilter;
    onApply: (updatedFilter: Partial<IAdvFilter>, options?: UpdateOptions) => void;
}

const FiltersWindow: FC<FiltersWindowProps> = ({filter, onApply}) => {
    const { data: categoriesAdvsCountData, isLoading:categoriesAdvsCountLoad, error:categoriesAdvsCountError } = useGetCategoriesWithCountsQuery();
    const categoriesAdvsCount = categoriesAdvsCountData?.payload ?? [];

    const [localFilter, setLocalFilter] = useState(filter);

    useEffect(() => {
        setLocalFilter(filter);
    }, [filter]);

    const handleCategoryClick = (id: number | null) => {
        setLocalFilter(prev => ({ ...prev, categoryId: id }));
    };

    const handleApply = () => {
        console.log(localFilter)
        onApply(localFilter, {resetPage: true, closeFilters: true, navigateCategory: true});
    }

    const handleReset = () => {
        const resetFilter: IAdvFilter = {
            ...filter,
            categoryId: null,
            minPrice: null,
            maxPrice: null,
            sortBy: null,
            order: null,
            pageNumber: 1
        };
        setLocalFilter(resetFilter);
        onApply(resetFilter, {resetPage: true, closeFilters: true, navigateCategory: true});
    };


    const isChecked = (sortBy: "date" | "price", order: "asc" | "desc") => {
        return localFilter.sortBy === sortBy && localFilter.order === order;
    };

    if (categoriesAdvsCountLoad) return <Loader />;
    if (categoriesAdvsCountError) return <div>Error</div>;

    return (
        <div className="w-[1423px] h-[688px] bg-[#EFF2F8] rounded-[5px] mx-auto mt-[40px] mb-[120px]">
            <div className="flex flex-row items-start gap-[100px] w-[1328px] h-[529px] mx-auto mt-[48px]">
                <div className="flex flex-col items-start gap-[12px] w-[350px] h-[529px] flex-none">
                    <span className="w-[257px] pl-[10px] h-[24px] font-inter font-semibold text-[20px] leading-[24px] text-[#071739]">
                        Категорії:
                    </span>

                    <div className="flex flex-col items-start gap-[12px] w-[350px] h-[503px] flex-none">
                        <span
                            className={`w-[257px] h-[19px] font-inter cursor-pointer font-normal text-[16px] pl-[10px] leading-[19px] text-[#071739] self-stretch ${
                                localFilter.categoryId === null ? "bg-[#E5ECFF] rounded-[8px]" : ""
                            }`}
                            onClick={() => handleCategoryClick(null)}
                        >
                            Будь яка категорія
                        </span>

                        <div className="flex flex-col items-end gap-[16px] w-[350px] h-[472px] flex-none self-stretch">
                            {categoriesAdvsCount.map(category => (
                                <CategoryFilterItem
                                    key={category.id}
                                    category={category}
                                    activeCategoryId={localFilter.categoryId}
                                    onClick={handleCategoryClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start p-0 gap-[20px] w-[257px] h-[325px] flex-none">
                    <div className="flex flex-col items-start p-0 gap-[12px] w-[257px] h-[120px] flex-none order-0">
                        <span className="w-[257px] h-[24px] font-inter font-semibold text-[20px] leading-[24px] text-[#071739] flex-none order-0">
                            Сортування:
                        </span>

                        <div className="flex flex-col items-start gap-[12px] w-[257px] h-[78px] flex-none order-1">
                            <div className="flex flex-row items-center gap-[8px] w-[257px] h-[19px] flex-none order-0">
                                <Checkbox
                                    checked={isChecked("date", "desc")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setLocalFilter(prev => ({ ...prev, sortBy: "date", order: "desc" }));
                                        } else {
                                            setLocalFilter(prev => ({ ...prev, sortBy: null, order: null }));
                                        }
                                    }}
                                />
                                <span className="w-[138px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none">
                                    За датою (новіші)
                                </span>
                            </div>

                            <div className="flex flex-row items-center gap-[8px] w-[257px] h-[19px] flex-none order-1">
                                <Checkbox
                                    checked={isChecked("price", "desc")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setLocalFilter(prev => ({ ...prev, sortBy: "price", order: "desc" }));
                                        } else {
                                            setLocalFilter(prev => ({ ...prev, sortBy: null, order: null }));
                                        }
                                    }}
                                />
                                <span className="w-[149px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none">
                                    Спочатку дорожче
                                </span>
                            </div>

                            <div className="flex flex-row items-center gap-[8px] w-[257px] h-[19px] flex-none order-2">
                                <Checkbox
                                    checked={isChecked("price", "asc")}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setLocalFilter(prev => ({ ...prev, sortBy: "price", order: "asc" }));
                                        } else {
                                            setLocalFilter(prev => ({ ...prev, sortBy: null, order: null }));
                                        }
                                    }}
                                />
                                <span className="w-[152px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none">
                                    Спочатку дешевше
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start p-0 gap-[12px] w-[257px] h-[106px] flex-none order-1">
                        <span className="w-[257px] h-[24px] font-inter font-semibold text-[20px] leading-[24px] text-[#071739] flex-none order-0">
                            Ціна:
                        </span>

                        <div className="flex flex-row items-center gap-[12px] w-[159px] h-[29px] flex-none order-1">
                            <div className="flex flex-row items-center gap-[32px] w-[131px] h-[24px] flex-none order-0">
                                <span className="w-[25px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none order-0">
                                    Від
                                </span>
                                <input
                                    type="number"
                                    min={0}
                                    value={localFilter.minPrice ?? ""}
                                    onChange={(e) => {
                                        let value = e.target.value ? Number(e.target.value) : null;
                                        if (value !== null && value < 0) value = 0; // додаткова перевірка
                                        setLocalFilter(prev => ({
                                            ...prev,
                                            minPrice: value,
                                            maxPrice: prev.maxPrice !== null && value !== null && prev.maxPrice < value
                                                ? value
                                                : prev.maxPrice
                                        }));
                                    }}
                                    className="w-[74px] h-[24px] border border-[#071739] rounded-[2px] text-[16px] font-inter px-1"
                                    placeholder="0"
                                />
                            </div>

                            <span className="w-[16px] h-[29px] font-inter font-normal text-[24px] leading-[29px] text-[#071739] flex-none order-1">
                                ₴
                            </span>
                        </div>

                        <div className="flex flex-row items-center gap-[12px] w-[159px] h-[29px] flex-none order-2">
                            <div className="flex flex-row items-center gap-[32px] w-[131px] h-[24px] flex-none order-0">
                                <span className="w-[25px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none order-0">
                                    До
                                </span>
                                <input
                                    type="number"
                                    min={0}
                                    value={localFilter.maxPrice ?? ""}
                                    onChange={(e) => {
                                        let value = e.target.value ? Number(e.target.value) : null;
                                        if (value !== null && value < 0) value = 0; // додаткова перевірка
                                        setLocalFilter(prev => ({
                                            ...prev,
                                            maxPrice: value !== null && prev.minPrice !== null && value < prev.minPrice
                                                ? prev.minPrice
                                                : value
                                        }));
                                    }}
                                    className="w-[74px] h-[24px] border border-[#071739] rounded-[2px] text-[16px] font-inter px-1"
                                    placeholder="0"
                                />
                            </div>

                            <span className="w-[16px] h-[29px] font-inter font-normal text-[24px] leading-[29px] text-[#071739] flex-none order-1">
                                ₴
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[1328px] mx-auto flex justify-end gap-[24px] mt-[5px]">
                <button
                    onClick={handleReset}
                    className="w-[179px] h-[47px] border border-[rgba(7,23,57,0.5)]
                           rounded-[5px] text-[16px] text-[rgba(7,23,57,0.5)]
                           transition hover:bg-gray-100"
                >
                    Скинути фільтри
                </button>

                <button
                    onClick={handleApply}
                    className="w-[194px] h-[47px] bg-[#4C7ADB]
                           rounded-[5px] text-white text-[16px]
                           transition hover:bg-[#3b69c7]"
                >
                    Застосувати
                </button>
            </div>
        </div>
    );
};

export default FiltersWindow;