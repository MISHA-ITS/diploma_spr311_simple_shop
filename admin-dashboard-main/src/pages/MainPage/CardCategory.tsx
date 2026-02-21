import EnvConfig from "../../config/env.ts";
import {ICategory} from "../../types/Category/types.ts";

type CardProps = {
    category: ICategory;
};

const Card: React.FC<CardProps> = ({ category }) => (
    <div className="w-[125px] h-[145px] flex flex-col items-center gap-[15px]">
        <img
            src={category.imageUrl ? `${EnvConfig.API_URL}/images/categories/800_${category.imageUrl}` : `${EnvConfig.API_URL}/images/noimage.jpeg`}
            alt={category.name}
            className="w-[100px] h-[100px] rounded-[5px]"
        />
        <span className="w-[125px] h-[24px] font-inter font-semibold text-[20px] leading-none tracking-normal text-center text-[#000000]">
            {category.name}
        </span>
    </div>
);

export default Card;
