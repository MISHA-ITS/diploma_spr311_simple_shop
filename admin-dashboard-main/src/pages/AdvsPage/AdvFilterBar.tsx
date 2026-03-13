import {FC, useState} from "react";
import rowsDisable from "../../icons/RowsDisable.png"
import blockEnable from "../../icons/BlocksEnable.png"
import blockDisable from "../../icons/BlocksDisable.png"
import rowsEnable from "../../icons/RowsEnable.png"
import FiltersToggleButton from "./FiltersToggleButton.tsx";
import CategoryChildsDropDown from "./CategoryChildsDropDown.tsx";
import {ICategory} from "../../models/category.ts";
import DateDropDown from "./DateDropDown.tsx";
import {DateFilter} from "./types.ts";

type AdvFilterBarProps = {
    countAdvs: number;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    isOpenFilters: boolean;
    onToggleFilters: () => void;
    category: ICategory | null;
    onCategoryChange: (childCategory: number | null) => void;
    dateFrom?: DateFilter | null;
    onDateChange: (dateFrom: DateFilter | null) => void;
}

const AdvFilterBar: FC<AdvFilterBarProps> = ({countAdvs, viewMode, onViewModeChange, onToggleFilters, isOpenFilters, category, onCategoryChange, dateFrom, onDateChange}) => {
    const [openDropdown, setOpenDropdown] = useState<"date" | "category" | null>(null);

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1428px] mt-5">
            {!isOpenFilters &&
                <div className="flex flex-row items-center justify-between h-[48px] w-full max-w-[1430px]">
                    <span className="text-[20px] leading-[24px] font-semibold font-inter text-[#071739] whitespace-nowrap shrink-0">
                        Знайдено {countAdvs} оголошень:
                    </span>
                </div>
            }

            <div className="flex items-center justify-between w-full max-w-[1428px] h-[48px]">
                <div className="flex items-center justify-between gap-[35px] h-[48px] shrink-0">
                    <FiltersToggleButton onToggle={onToggleFilters} isOpen={isOpenFilters} />

                    {!isOpenFilters && (
                        <>
                            <CategoryChildsDropDown
                                category={category}
                                isOpen={openDropdown === "date"}
                                onToggle={() => setOpenDropdown(prev => prev === "date" ? null : "date")}
                                onChangeCategory={onCategoryChange}
                            />

                            <DateDropDown
                                date={dateFrom}
                                isOpen={openDropdown === "category"}
                                onToggle={() => setOpenDropdown(prev => prev === "category" ? null : "category")}
                                onDateChange={onDateChange}
                            />
                        </>
                    )}
                </div>

                <div className="flex items-center gap-[23px] w-[91px] h-[28px] shrink-0">
                    <img
                        src={viewMode === "grid" ? rowsDisable : rowsEnable}
                        alt="List view"
                        className="w-[40px] h-[28px] cursor-pointer shrink-0"
                        onClick={() => onViewModeChange('list')}
                    />

                    <img
                        src={viewMode === "grid" ? blockEnable : blockDisable}
                        alt="Grid view"
                        className="w-[28px] h-[28px] cursor-pointer shrink-0"
                        onClick={() => onViewModeChange('grid')}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdvFilterBar