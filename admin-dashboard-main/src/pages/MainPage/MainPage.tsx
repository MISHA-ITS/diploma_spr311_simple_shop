import * as React from "react";
//import {useGetAllCategoriesQuery} from "../../store/api/categoryApi.ts";
import SearchBlock from "./SearchBlock.tsx";
import PromoBlock from "./PromoBlock.tsx";
import CategoriesBlock from "./CategoriesBlock.tsx";
import {useGetAllCategoriesQuery} from "../../services/apiCategory.ts";

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