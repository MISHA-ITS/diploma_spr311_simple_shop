import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {IAdvFilter, UpdateOptions} from "../pages/AdvsPage/types.ts";

const createFilter = (categoryId?: string | number): IAdvFilter => ({
    categoryId: categoryId ? Number(categoryId) : null,
    settlementRef: null,
    search: null,
    minPrice: null,
    maxPrice: null,
    date: null,
    active: true,
    sortBy: null,
    order: "asc",
    pageNumber: 1,
    pageSize: 24,
});

export const useAdvFilter = (onClose?: () => void) => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const searchParam = searchParams.get("search");
    const settlementParam = searchParams.get("settlementRef");

    const [filter, setFilter] = useState<IAdvFilter>(() => createFilter(id));

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            categoryId: id ? Number(id) : null,
            search: searchParam,
            settlementRef: settlementParam,
            pageNumber: 1
        }));
    }, [id, searchParam, settlementParam]);

    const updateFilter = (
        updatedFields: Partial<IAdvFilter>,
        options?: UpdateOptions
    ) => {
        setFilter(prev => {
            const newFilter = {
                ...prev,
                ...updatedFields,
                pageNumber: options?.resetPage ? 1 : (updatedFields.pageNumber ?? prev.pageNumber),
            };

            if (options?.navigateCategory && newFilter.categoryId !== prev.categoryId) {
                navigate(
                    newFilter.categoryId
                        ? `/advertisements/${newFilter.categoryId}`
                        : `/advertisements`
                );
            }

            return newFilter;

        });

        if (options?.closeFilters && onClose) {
            onClose();
        }
    };

    return {
        filter,
        updateFilter,
        categoryId: id,
    };
};