import { Link } from "react-router-dom";
import {ICategory} from "../../models/category.ts";
import {FC} from "react";
import {createParentDic, findPath} from "../Advertisement/utils/functions.ts";

interface CategoryPathProps {
    categories: ICategory[];
    targetId: number | null;
}

const CategoryPath: FC<CategoryPathProps> = ({ categories, targetId }) => {
    if (!targetId) return <span>Всі оголошення</span>;

    const parentDic = createParentDic(categories);
    const pathIds = findPath(targetId, parentDic);

    const categoryNamesDic = categories.reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
    }, {} as Record<number, string>);

    return (
        <>
            {pathIds.map((id, index) => (
                <span key={id}>
                    <Link
                        to={`/advertisements/${id}`}
                        className="hover:underline"
                    >
                        {categoryNamesDic[id]}
                    </Link>
                    {index < pathIds.length - 1 && " / "}
                </span>
            ))}
        </>
    );
};

export default CategoryPath;