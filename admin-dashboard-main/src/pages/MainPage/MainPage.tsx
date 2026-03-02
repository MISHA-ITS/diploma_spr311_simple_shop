import * as React from "react";
//import {useGetAllCategoriesQuery} from "../../store/api/categoryApi.ts";
import SearchBlock from "./SearchBlock.tsx";
import PromoBlock from "./PromoBlock.tsx";
import CategoriesBlock from "./CategoriesBlock.tsx";
import {useGetAllCategoriesQuery} from "../../services/apiCategory.ts";
import Explore from "./Explore.tsx";

const MainPage : React.FC = () => {
    const { data: categoriesData, isLoading } = useGetAllCategoriesQuery();
    if (isLoading) return null;

    const categories = categoriesData?.payload;

    return (
        <>
            <div className="flex flex-col bg-[#F8FAFF] items-center w-full">
                <SearchBlock />

                <CategoriesBlock categories={categories!} />

                <PromoBlock />

                <Explore />
            </div>
        </>
    )
}

export default MainPage;