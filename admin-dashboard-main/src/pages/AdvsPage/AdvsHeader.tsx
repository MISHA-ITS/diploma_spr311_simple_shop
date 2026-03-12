import { FC } from "react";
import { Link } from "react-router-dom";
import CategoryPath from "./CategoryPath.tsx";
import { IAdvFilter } from "./types.ts";
import { ICategory } from "../../models/category.ts";

type AdvsHeaderProps = {
    filter: IAdvFilter;
    allCategories: ICategory[];
};

const AdvsHeader: FC<AdvsHeaderProps> = ({ filter, allCategories }) => (
    <div className="flex flex-col gap-4 w-full max-w-[1430px]">

        <span className="font-inter mt-[50px] font-light text-[14px] leading-[14px] tracking-normal antialiased text-[#071739]">
            <Link to="/" className="hover:underline">Головна сторінка</Link>{" / "}
            <CategoryPath categories={allCategories} targetId={filter.categoryId} />
        </span>
    </div>
);

export default AdvsHeader;