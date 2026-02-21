import CardCategory from "./CardCategory.tsx";
import {ICategory} from "../../types/Category/types.ts";

type CardRowProps = {
    categories: ICategory[];
};

const CardRow: React.FC<CardRowProps> = ({ categories }) => (
    <div className="flex w-fit justify-center gap-6 mx-24.5 mb-7">
        {categories.map((category, i) => (
            <CardCategory key={i} category={category} />
        ))}
    </div>
)

export default CardRow