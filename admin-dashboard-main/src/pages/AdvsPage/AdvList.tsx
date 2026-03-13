import {FC} from "react";
import {IAdvFilter} from "./types.ts";
import PaginationContainer from "./PaginationContainer.tsx";
import AdvSection from "./AdvSection.tsx";
import {IAdvertisement} from "../Advertisement/types.ts";

type AdvListProps = {
    viewMode: 'grid' | 'list';
    advs: IAdvertisement[];
    filter: IAdvFilter;
    totalCount: number;
    onPageChange: (page: number) => void;
};

export const AdvList: FC<AdvListProps> = ({ viewMode, advs, filter, totalCount, onPageChange }) => {
    return (
        <>
            <AdvSection viewMode={viewMode} advertisements={advs}/>
            <PaginationContainer
                totalCount={totalCount}
                adsOnPage={filter.pageSize}
                pageNumber={filter.pageNumber}
                onPageChange={onPageChange}
            />
        </>
        )
};