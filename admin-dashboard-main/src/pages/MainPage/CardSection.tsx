import {ICategory} from "../../types/Category/types.ts";
import CardRow from "./CardRow.tsx";

type CardSectionProps = {
    categories: ICategory[];
};

const CardSection: React.FC<CardSectionProps> = ({ categories }) => {
    const parentCategories = categories.filter(
        category => category.parentId === null
    );

    const rows = [];

    for (let i = 0; i < parentCategories.length; i += 6) {
        rows.push(parentCategories.slice(i, i + 6));
    }

    return (
        <div className="w-[1364px] mx-auto flex flex-col gap-[52px]">
            {rows.map((rowCategories, i) => (
                <CardRow key={i} categories={rowCategories} />
            ))}
        </div>
    )
}

export default CardSection;