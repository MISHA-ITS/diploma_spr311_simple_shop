import {FC, useEffect, useState} from "react";
import SearchBlock from "../MainPage/SearchBlock.tsx";
import {Link, Navigate, useParams} from "react-router-dom";
import {useGetCategoryByIdQuery} from "../../services/apiCategory.ts";
import {IAdvFilter} from "./types.ts";
import {useGetAdvertisementsQuery} from "../../services/apiAdvertisement.ts";
import AdvFilterBar from "./AdvFilterBar.tsx";
import AdvSection from "./AdvSection.tsx";
import PaginationContainer from "./PaginationContainer.tsx";
import FiltersWindow from "./FiltersWindow.tsx";

const AdvsPage: FC = () => {
    const { id } = useParams<{ id?: string }>();

    const categoryId = id ? Number(id) : null;

    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filter, setFilter] = useState<Omit<IAdvFilter, 'categoryId'>>({
        minPrice: null,
        maxPrice: null,
        sortBy: null,
        order: "asc",
        pageNumber: 1,
        pageSize: 24
    });

    const effectiveFilter: IAdvFilter = {
        ...filter,
        categoryId
    };

    const { data: categoryData, isLoading: categoryLoad, error: categoryError } = useGetCategoryByIdQuery(id!, {
        skip: !id
    });

    console.log("Effective filter перед запитом:", effectiveFilter);
    const { data: advData, isLoading: advLoad, error: advError } = useGetAdvertisementsQuery(effectiveFilter);

    const updateFilter = (updatedFields: Partial<Omit<IAdvFilter, 'categoryId'>>, resetPage = false) => {
        setFilter(prev => ({ ...prev, ...updatedFields, pageNumber: resetPage ? 1 : (updatedFields.pageNumber ?? prev.pageNumber) }));
    };

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode);
        updateFilter({
            pageSize: mode === 'grid' ? 24 : 8
        }, true);
    };
    if (id && (categoryLoad || !categoryData)) return <div></div>;

    if (categoryError || advError) {
        return <Navigate to="/" replace />;
    }

    if (!advData || advLoad) return null;

    const category = categoryData?.payload ?? null;
    const advs = advData.payload.items;

    console.log(advData)

    return (
        <>
            <div className="flex flex-col bg-[#F8FAFF] items-center w-full">
                <SearchBlock />

                {!isOpenFilters &&
                    <div className="w-full max-w-[1430px] mt-[50px]">
                        <span className="font-inter font-light text-[14px] leading-[14px] tracking-normal antialiased text-[#071739]">
                            <Link to="/" className="hover:underline">
                                Головна сторінка
                            </Link>
                            {" "}
                            / {category?.name ?? "Всі оголошення"}
                        </span>
                    </div>
                }

                <AdvFilterBar
                    countAdvs={advs.length}
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                    isOpenFilters={isOpenFilters}
                    onToggleFilters={() => setIsOpenFilters(prev => !prev)}
                />

                {isOpenFilters ? (
                    <FiltersWindow />
                ) : (
                    <>
                        <AdvSection viewMode={viewMode} advertisements={advs} />

                        <PaginationContainer
                            totalCount={advData.payload.totalCount}
                            adsOnPage={filter.pageSize}
                            pageNumber={filter.pageNumber}
                            onPageChange={(page) => updateFilter({ pageNumber: page }, false)}
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default AdvsPage;