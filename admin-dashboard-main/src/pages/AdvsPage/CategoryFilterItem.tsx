import { FC } from "react";
import {ICategoryWithCount} from "../../types/Category/types.ts";

type CategoryItemProps = {
    category: ICategoryWithCount
}

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {
    return (
        <div className="flex flex-row justify-between items-stretch w-[257px] cursor-pointer flex-none self-stretch">
            <span className="font-inter font-normal text-[16px] max-w-[151px] leading-[19px] text-[#071739] flex-none">
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

export default CategoryItem;