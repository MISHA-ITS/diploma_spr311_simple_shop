export interface IAdvFilter {
    categoryId: number | null;
    minPrice: number | null;
    maxPrice: number | null;

    sortBy: string | null;
    order: string;

    pageNumber: number;
    pageSize: number;
}