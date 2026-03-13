export interface IAdvFilter {
    categoryId: number | null;
    settlementRef: string | null;
    search: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    date: DateFilter | null;

    active: boolean | null;

    sortBy: "date" | "price" | null;
    order: "asc" | "desc" | null;

    pageNumber: number;
    pageSize: number;
}

export type DateFilter = "today" | "week" | "month";

export type UpdateOptions = {
    resetPage?: boolean;
    navigateCategory?: boolean;
    closeFilters?: boolean;
}

export type ViewMode = 'grid' | 'list';