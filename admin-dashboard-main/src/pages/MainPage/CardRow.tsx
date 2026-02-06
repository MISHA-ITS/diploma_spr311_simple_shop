import CardCategory from "./CardCategory.tsx";
import {ICategory} from "../../types/Category/types.ts";

type CardRowProps = {
    categories: ICategory[];
};

const CardRow: React.FC<CardRowProps> = ({ categories }) => (
    <div className="w-full flex justify-between">
        {categories.map((category, i) => (
            <CardCategory key={i} category={category} />
        ))}
    </div>
)

export default CardRow