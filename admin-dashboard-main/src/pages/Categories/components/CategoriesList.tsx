import { useEffect, useState } from "react";
import axios from "axios";
import EnvConfig from "../../../config/env.ts";
import { ICategoryItem } from "../types.ts";
import CategoriesCard from "./CategoriesCard.tsx";
import CategoryRow from "./CategoryRow.tsx";

const CategoriesList: React.FC = () => {

    const urlCategories = `${EnvConfig.API_URL}/api/Category/list`;

    const [categories, setCategories] = useState<ICategoryItem[]>([]);

    useEffect(() => {
        axios.get(urlCategories)
            .then(resp => {
                console.log("Categories API:", resp.data);
                setCategories(resp.data.payload);
            })
            .catch(err => {
                console.error("Categories error", err);
            });
    }, []);

    const handleDeleteCategory = async (categoryId: number) => {
        if (!confirm("Ви впевнені, що хочете видалити категорію?")) return;

        try {
            const res = await fetch(
                `${EnvConfig.API_URL}/api/Category/Delete?id=${categoryId}`,
                { method: "DELETE" }
            );

            if (!res.ok) {
                alert("Помилка при видаленні");
                return;
            }

            setCategories(prev =>
                prev.filter(c => c.id !== categoryId)
            );

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full">

            <CategoriesCard count={categories.length}>
                <table className="min-w-full text-left">
                    <thead className="bg-neutral-50 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Назва</th>
                        <th className="px-4 py-2">Дії</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {categories.map(c => (
                        <CategoryRow
                            key={c.id}
                            category={c}
                            onDeleteCategory={handleDeleteCategory}
                        />
                    ))}
                    </tbody>
                </table>
            </CategoriesCard>

        </div>
    );
};

export default CategoriesList;
