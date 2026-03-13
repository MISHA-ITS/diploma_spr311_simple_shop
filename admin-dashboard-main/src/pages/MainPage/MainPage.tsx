import * as React from "react";
import SearchBlock from "./SearchBlock.tsx";
import PromoBlock from "./PromoBlock.tsx";
import CategoriesBlock from "./CategoriesBlock.tsx";
import {useGetAllCategoriesQuery} from "../../services/apiCategory.ts";
import Explore from "./Explore.tsx";
import Loader from "../../components/Loader.tsx";
import {useState} from "react";

const MainPage: React.FC = () => {
    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const categories = categoriesData?.payload;

    const shouldShowLoader = isCategoriesLoading || isSearchLoading || !categories;

    return (
        <div className="flex flex-col bg-[#F8FAFF] items-center w-full min-h-screen">
            <SearchBlock onLoadingChange={setIsSearchLoading} />

            {shouldShowLoader ? (
                <div className="flex justify-center items-center w-full mt-10">
                    <Loader />
                </div>
            ) : (
                <>
                    <CategoriesBlock categories={categories} />
                </>
            )}
            <PromoBlock />
            <Explore />
        </div>
    );
}

export default MainPage;