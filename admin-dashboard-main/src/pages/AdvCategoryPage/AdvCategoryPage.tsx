import {FC, useEffect, useState} from "react";
import SearchBlock from "../MainPage/SearchBlock.tsx";
import {Link, Navigate, useParams} from "react-router-dom";
import {useGetCategoryByIdQuery} from "../../services/apiCategory.ts";
import {IAdvFilter} from "./types.ts";
import {useGetAdvertisementsQuery} from "../../services/apiAdvertisement.ts";
import AdvFilterBar from "./AdvFilterBar.tsx";
import AdvSection from "./AdvSection.tsx";
import PaginationContainer from "./PaginationContainer.tsx";

const AdvCategoryPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filter, setFilter] = useState<IAdvFilter>({
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        sortBy: null,
        order: "asc",
        pageNumber: 1,
        pageSize: 24
    });

    const { data: categoryData, isLoading: categoryLoad, error: categoryError } = useGetCategoryByIdQuery(id!, {
        skip: !id
    });

    const { data: advData, isLoading: advLoad, error: advError } = useGetAdvertisementsQuery(filter, {
        skip: !filter.categoryId
    });

    useEffect(() => {
        if (id) {
            setFilter(prev => ({ ...prev, categoryId: Number(id) }));
        }
    }, [id]);

    const updateFilter = (updatedFields: Partial<IAdvFilter>) => {
        setFilter(prev => ({ ...prev, ...updatedFields }));
    };

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode);
        updateFilter({
            pageSize: mode === 'grid' ? 24 : 8,
            pageNumber: 1
        });
    };

    if (categoryLoad || advLoad) return <div></div>;

    if (categoryError || advError) {
        return <Navigate to="/" replace />;
    }

    if (!categoryData || !advData) return null;

    const category = categoryData!.payload;
    const advs = advData!.payload.items;

    console.log(advData)

    return (
        <>
            <div className="flex flex-col bg-[#F8FAFF] items-center w-full">
                <SearchBlock />

                <div className="w-full max-w-[1430px] mt-[50px]">
                    <span className="font-inter font-light text-[14px] leading-[14px] tracking-normal antialiased text-[#071739]">
                        <Link to="/" className="hover:underline">
                            Головна сторінка
                        </Link>{" "}
                        / {category.name}
                    </span>
                </div>

                <AdvFilterBar countAdvs={advs.length} viewMode={viewMode} onViewModeChange={handleViewModeChange} />

                <AdvSection viewMode={viewMode} advertisements={advs} />
                
                <PaginationContainer totalCount={advData.payload.totalCount}
                                     adsOnPage={advData.payload.pageSize}
                                     pageNumber={advData.payload.pageNumber}
                                     onPageChange={(page) => updateFilter({ pageNumber: page})} />
            </div>
        </>
    );
}

export default AdvCategoryPage;