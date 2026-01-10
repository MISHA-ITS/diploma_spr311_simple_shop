import { useEffect, useState } from "react";
import axios from "axios";
import { buildCategoryTree} from "./utils/buildTree.ts";
import {CategoryNode} from "./types.ts";
import SidebarCategoryItem from "./SidebarCategoryItem";
import EnvConfig from "../../config/env.ts";

const CategoriesSidebar = () => {
    const [tree, setTree] = useState<CategoryNode[]>([]);
    const urlCategories = `${EnvConfig.API_URL}/api/Category/list`;

    console.log(urlCategories);

    useEffect(() => {
        axios.get(urlCategories)
            .then(res => {
                const tree = buildCategoryTree(res.data);
                setTree(tree);
            });
    }, []);

    return (
        <ul className="mt-2 space-y-1">
            {tree.map(cat => (
                <SidebarCategoryItem
                    key={cat.id}
                    category={cat}
                    level={0}
                />
            ))}
        </ul>
    );
};

export default CategoriesSidebar;
