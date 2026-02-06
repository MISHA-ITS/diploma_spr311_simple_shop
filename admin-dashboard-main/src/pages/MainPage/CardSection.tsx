import {ICategory} from "../../types/Category/types.ts";
import CardRow from "./CardRow.tsx";

type CardSectionProps = {
    categories: ICategory[];
};

const CardSection: React.FC<CardSectionProps> = ({ categories }) => {
    const rows = [];

    for (let i = 0; i < categories.length; i += 8) {
        rows.push(categories.slice(i, i + 8));
    }

    return (
        <div className="w-[1364px] flex flex-col gap-[52px] items-center">
            {rows.map((rowCategories, i) => (
                <CardRow key={i} categories={rowCategories} />
            ))}
        </div>
    )
}

export default CardSection;