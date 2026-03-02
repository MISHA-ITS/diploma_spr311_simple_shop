import EnvConfig from "../../config/env.ts";
import {ICategory} from "../../types/Category/types.ts";
import {useNavigate} from "react-router";
import {FC} from "react";

type CardProps = {
    category: ICategory;
};

const Card: FC<CardProps> = ({ category }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/category/" + category.id);
    }

    return (
        <button
            onClick={handleClick}
            className="w-[125px] h-[145px] flex flex-col items-center gap-[15px]"
        >
            <img
                src={
                    category.imageUrl
                        ? `${EnvConfig.API_URL}/images/categories/800_${category.imageUrl}`
                        : `${EnvConfig.API_URL}/images/noimage.jpeg`
                }
                alt={category.name}
                className="w-[100px] h-[100px] rounded-[5px]"
            />
            <span className="w-[125px] h-[24px] font-inter font-semibold text-[20px] leading-none text-center text-[#000000]">
                {category.name}
            </span>
        </button>
    )
}

export default Card;
