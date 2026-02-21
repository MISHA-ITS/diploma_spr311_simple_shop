import * as React from "react";
import {useGetAllCategoriesQuery} from "../../services/apiCategory.ts";
import SearchBlock from "./SearchBlock.tsx";
import PromoBlock from "./PromoBlock.tsx";
import CategoriesBlock from "./CategoriesBlock.tsx";

const MainPage : React.FC = () => {
    const { data: categoriesData, isLoading } = useGetAllCategoriesQuery();
    if (isLoading) return null;

    const categories = categoriesData?.payload;

    return (
        <>
            <div className="flex flex-col items-center w-full">
                <SearchBlock />

                <CategoriesBlock categories={categories!} />

                <PromoBlock />
            </div>
        </>
    )
}

export default MainPage;