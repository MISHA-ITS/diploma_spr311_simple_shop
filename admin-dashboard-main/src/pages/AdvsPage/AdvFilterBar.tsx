import {FC} from "react";
import rowsDisable from "../../icons/RowsDisable.png"
import blockEnable from "../../icons/BlocksEnable.png"
import blockDisable from "../../icons/BlocksDisable.png"
import rowsEnable from "../../icons/RowsEnable.png"
import moreIcon from "../../icons/More.png"
import FiltersToggleButton from "./FiltersToggleButton.tsx";

type AdvFilterBarProps = {
    countAdvs: number;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    isOpenFilters: boolean;
    onToggleFilters: () => void;

}

const AdvFilterBar: FC<AdvFilterBarProps> = ({countAdvs, viewMode, onViewModeChange, onToggleFilters, isOpenFilters}) => {
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
                <div className="flex items-center gap-[40px] w-[547px] h-[48px] shrink-0">
                    <FiltersToggleButton onToggle={onToggleFilters} isOpen={isOpenFilters} />

                    {!isOpenFilters && (
                        <>
                            <button className="flex justify-center items-center px-3 py-3 gap-6 w-[146px] h-[48px] border-2 border-[rgba(0,23,72,0.58)] rounded-[5px]">
                                <span className="font-inter font-normal text-[16px] leading-[19px] text-[rgba(7,23,57,0.5)]">
                                    Категорія
                                </span>

                                <img src={moreIcon} alt="More" />
                            </button>

                            <button className="flex justify-center items-center px-4 py-3 gap-6 w-[181px] h-[48px] border-2 border-[rgba(0,23,72,0.58)] rounded-[5px]">
                                <span className="font-inter font-normal text-[16px] leading-[19px] text-[rgba(7,23,57,0.5)] shrink-0">
                                    Час публікації
                                </span>

                                <img src={moreIcon} alt="More" />
                            </button>
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