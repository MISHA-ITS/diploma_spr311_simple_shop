import {FC, useEffect, useMemo, useState} from "react";
import SearchBlock from "../MainPage/SearchBlock.tsx";
import {Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {useGetCategoryByIdQuery} from "../../services/apiCategory.ts";
import {IAdvFilter} from "./types.ts";
import {useGetAdvertisementsQuery} from "../../services/apiAdvertisement.ts";
import AdvFilterBar from "./AdvFilterBar.tsx";
import AdvSection from "./AdvSection.tsx";
import PaginationContainer from "./PaginationContainer.tsx";
import FiltersWindow from "./FiltersWindow.tsx";

const createFilter = (categoryId?: string | number): IAdvFilter => ({
    categoryId: categoryId ? Number(categoryId) : null,
    settlementRef: null,
    search: null,
    minPrice: null,
    maxPrice: null,
    sortBy: null,
    order: "asc",
    pageNumber: 1,
    pageSize: 24,
});

const AdvsPage: FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const searchParam = searchParams.get("search");
    const settlementParam = searchParams.get("settlementRef");

    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filter, setFilter] = useState<IAdvFilter>(createFilter(id));

    // Запити
    const { data: categoryData, isLoading: categoryLoad, error: categoryError } = useGetCategoryByIdQuery(id!, {
        skip: !id
    });

    const { data: advData, isLoading: advLoad, error: advError } = useGetAdvertisementsQuery(filter);
    //

    const advs = useMemo(() => advData?.payload.items ?? [], [advData]);
    const categoryName = id ? categoryData?.payload?.name ?? "" : "Всі оголошення";

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            categoryId: id ? Number(id) : null,
            pageNumber: 1,
        }));
    }, [id]);

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            search: searchParam,
            settlementRef: settlementParam,
            pageNumber: 1
        }));
    }, [searchParam, settlementParam]);


    const updateFilter = (updatedFields: Partial<IAdvFilter>, resetPage = false) => {
        setFilter((prev) => ({
            ...prev,
            ...updatedFields,
            pageNumber: resetPage ? 1 : prev.pageNumber,
        }));
    };

    const handleViewModeChange = (mode: 'grid' | 'list') => {
        setViewMode(mode);
        updateFilter({pageSize: mode === 'grid' ? 24 : 8}, true);
    };

    const handleApplyFilters = (updatedFilter: IAdvFilter) => {
        if (updatedFilter.categoryId !== filter.categoryId) {
            navigate(
                updatedFilter.categoryId
                    ? `/advertisements/${updatedFilter.categoryId}`
                    : `/advertisements`
            );
        }

        setFilter({
            ...updatedFilter,
            pageNumber: 1,
        });

        setIsOpenFilters(false);
    };

    if (categoryError || advError) return <Navigate to="/" replace />;

    if (categoryLoad || advLoad) return <div></div>;

    return (
        <>
            <div className="flex flex-col bg-[#F8FAFF] items-center w-full">
                <SearchBlock
                    search={filter.search}
                    onSearchChange={(searchWords) => updateFilter({ search: searchWords })}
                    settlementRef={filter.settlementRef}
                    onSettlementChange={(settlement) => updateFilter({ settlementRef: settlement ? settlement.ref : null })}
                />

                {!isOpenFilters &&
                    <div className="w-full max-w-[1430px] mt-[50px]">
                        <span className="font-inter font-light text-[14px] leading-[14px] tracking-normal antialiased text-[#071739]">
                            <Link to="/" className="hover:underline">Головна сторінка</Link>{" / "}{categoryName}
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
                    <FiltersWindow
                        categoryId={filter.categoryId}
                        filter={filter}
                        onApply={handleApplyFilters}
                    />
                ) : (
                    <>
                        <AdvSection viewMode={viewMode} advertisements={advs} />

                        <PaginationContainer
                            totalCount={advData?.payload.totalCount ?? 0}
                            adsOnPage={filter.pageSize}
                            pageNumber={filter.pageNumber}
                            onPageChange={(page) => updateFilter({ pageNumber: page })}
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default AdvsPage;