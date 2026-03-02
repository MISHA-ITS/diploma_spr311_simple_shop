import {FC, useState} from "react";
import rowsDisable from "../../icons/RowsDisable.png"
import blockEnable from "../../icons/BlocksEnable.png"
import blockDisable from "../../icons/BlocksDisable.png"
import rowsEnable from "../../icons/RowsEnable.png"
import filtersIconClosed from "../../icons/FiltersIcon.png"
import filtersIconOpen from "../../icons/FiltersIconOpen.png"
import moreIcon from "../../icons/More.png"

type AdvFilterBarProps = {
    countAdvs: number;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

const AdvFilterBar: FC<AdvFilterBarProps> = ({countAdvs, viewMode, onViewModeChange}) => {
    const [isOpenFilters, setIsOpenFilters] = useState(false);

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1428px] mt-5">
            <div className="flex flex-row items-center justify-between h-[48px] w-full max-w-[1430px]">
                <span className="text-[20px] leading-[24px] font-semibold font-inter text-[#071739] whitespace-nowrap shrink-0">
                    Знайдено {countAdvs} оголошень:
                </span>
            </div>

            <div className="flex items-center justify-between w-full max-w-[1428px] h-[48px]">
                <div className="flex items-center gap-[40px] w-[547px] h-[48px] shrink-0">
                    <button
                        className={`flex justify-center items-center px-3 py-2 gap-4 w-[140px] h-[48px] rounded-[5px]
                            ${isOpenFilters ? 'bg-[#4C7ADB] border-none' : 'border-[2px] border-[rgba(0,23,72,0.58)] bg-transparent'}`}
                        onClick={() => setIsOpenFilters(!isOpenFilters)}
                    >
                        <div>
                            <img
                                src={isOpenFilters ? filtersIconOpen : filtersIconClosed}
                                alt="filters"
                            />
                        </div>

                        <span className={`font-inter font-normal text-[16px] leading-[19px] 
                            ${isOpenFilters ? 'text-white' : 'text-[rgba(7,23,57,0.5)]'}`}
                        >
                            Фільтри
                        </span>
                    </button>

                    <button
                        className="flex justify-center items-center px-3 py-3 gap-6 w-[146px] h-[48px] border-[2px] border-[rgba(0,23,72,0.58)] rounded-[5px]"
                    >
                        <span className="font-inter font-normal text-[16px] leading-[19px] text-[rgba(7,23,57,0.5)]">
                            Категорія
                        </span>

                        <img src={moreIcon} alt="More"/>
                    </button>

                    <button className="flex justify-center items-center px-4 py-3 gap-6 w-[181px] h-[48px] border-[2px] border-[rgba(0,23,72,0.58)] rounded-[5px]">
                        <span className="font-inter font-normal text-[16px] leading-[19px] text-[rgba(7,23,57,0.5)] shrink-0">
                            Час публікації
                        </span>

                        <img src={moreIcon} alt="More"/>
                    </button>
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