import { FC } from "react";
import {ICategoryWithCount} from "../../types/Category/types.ts";

type CategoryItemProps = {
    category: ICategoryWithCount
    activeCategoryId: number | null
    onClick: (id: number) => void
}

const CategoryFilterItem: FC<CategoryItemProps> = ({ category, activeCategoryId, onClick }) => {
    const isSelected = activeCategoryId === category.id;

    return (
        <div
            onClick={() => onClick(category.id)}
            className={`
                flex flex-row justify-between items-stretch
                w-[350px] cursor-pointer self-stretch
                transition-colors py-[0.5px] duration-200
                ${isSelected ? "bg-[#E5ECFF] rounded-[8px]" : ""}
            `}
        >
            <span className="font-inter font-normal text-[16px] max-w-[240px] pl-[10px] leading-[19px] text-[#071739] flex-none">
                {category.name}
            </span>
            <div className="flex flex-row justify-center items-center w-[62px] px-[12px] gap-[24px] rounded-[5px] flex-none">
                <span className="font-inter font-light text-[14px] leading-[17px] text-[#071739] flex-none">
                    {category.advCount}
                </span>
            </div>
        </div>
    );
};

export default CategoryFilterItem;