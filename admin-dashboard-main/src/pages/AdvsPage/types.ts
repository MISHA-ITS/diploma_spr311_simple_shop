export interface IAdvFilter {
    categoryId: number | null;
    settlementRef: string | null;
    search: string | null;
    minPrice: number | null;
    maxPrice: number | null;

    sortBy: "date" | "price" | null;
    order: "asc" | "desc" | null;

    pageNumber: number;
    pageSize: number;
}