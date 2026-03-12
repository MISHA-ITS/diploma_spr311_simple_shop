import {FC, useState} from "react";
import {Navigate} from "react-router-dom";
import {useGetAllCategoriesQuery, useGetCategoryByIdQuery} from "../../services/apiCategory.ts";
import {ViewMode} from "./types.ts";
import {useGetAdvertisementsQuery} from "../../services/apiAdvertisement.ts";
import AdvFilterBar from "./AdvFilterBar.tsx";
import FiltersWindow from "./FiltersWindow.tsx";
import Loader from "../../components/Loader.tsx";
import {getLocalStorage, saveLocalStorage} from "../../utils/secureStore.ts";
import AdvsHeader from "./AdvsHeader.tsx";
import {AdvList} from "./AdvList.tsx";
import {useAdvFilter} from "../../utils/useAdvFilter.tsx";
import SearchBlock from "../MainPage/SearchBlock.tsx";

const AdvsPage: FC = () => {
    const { filter, updateFilter, categoryId } = useAdvFilter(() => setIsOpenFilters(false));

    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        const saved = getLocalStorage("advsViewMode");
        return saved === "list" ? "list" : "grid";
    });

    // Запити
    const { data: categoryData, isLoading: categoryLoad, error: categoryError } = useGetCategoryByIdQuery(categoryId ?? "", {
        skip: !categoryId
    })
    const { data: allCategoriesData, isLoading: allCategoriesLoading, error: allCategoriesError } = useGetAllCategoriesQuery();
    const { data: advData, isLoading: advLoad, error: advError } = useGetAdvertisementsQuery(filter);
    //

    const advs = advData?.payload.items ?? [];
    const allCategories = allCategoriesData?.payload ?? [];
    const category = categoryData?.payload ?? null;

    const handleViewModeChange = (mode: ViewMode) => {
        if (mode === viewMode) return;

        setViewMode(mode);
        saveLocalStorage("advsViewMode", mode);
        updateFilter({ pageSize: mode === 'grid' ? 24 : 8 }, { resetPage: true });
    };

    if (categoryError || advError || allCategoriesError) return <Navigate to="/" replace />;
    if (categoryLoad || advLoad || allCategoriesLoading) return <Loader />;

    console.log(advs)

    return (
        <>
            <div className="flex flex-col bg-[#F8FAFF] items-center w-full">
                <SearchBlock
                    search={filter.search}
                    onSearchChange={(searchWords) => updateFilter({ search: searchWords }, { resetPage: true })}
                    settlementRef={filter.settlementRef}
                    onSettlementChange={(settlement) => updateFilter({ settlementRef: settlement ? settlement.ref : null }, { resetPage: true })}
                />

                {!isOpenFilters && (
                    <AdvsHeader
                        filter={filter}
                        allCategories={allCategories}
                    />
                )}

                <AdvFilterBar
                    countAdvs={advData?.payload.totalCount ?? 0}
                    viewMode={viewMode}
                    onViewModeChange={handleViewModeChange}
                    isOpenFilters={isOpenFilters}
                    onToggleFilters={() => setIsOpenFilters(prev => !prev)}
                    category={category}
                    onCategoryChange={(childId) => updateFilter({ categoryId: childId }, { resetPage: true, navigateCategory: true})}
                    dateFrom={filter.date}
                    onDateChange={(fromDate) => updateFilter({ date: fromDate }, { resetPage: true})}
                />

                {isOpenFilters ? (
                    <FiltersWindow
                        filter={filter}
                        onApply={updateFilter}
                    />
                ) : (

                    <AdvList
                        viewMode={viewMode}
                        advs={advs}
                        filter={filter}
                        totalCount={advData?.payload.totalCount ?? 0}
                        onPageChange={(page) => {
                            updateFilter({ pageNumber: page });
                            window.scrollTo({ top: 0, behavior: "auto"});
                        }}
                    />
                )}
            </div>
        </>
    );
}

export default AdvsPage;