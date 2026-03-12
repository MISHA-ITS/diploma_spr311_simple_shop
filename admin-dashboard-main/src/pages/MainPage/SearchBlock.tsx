import {FC, useEffect, useState} from "react";
import SearchIcon from "../../icons/Search.png";
import {useGetAreasQuery, useGetSettlementsQuery} from "../../services/apiNewPost.ts";
import {IArea, ISettlement} from "../../models/newPost.ts";
import AreasDropDown from "./AreasDropDown.tsx";
import {useLocation, useNavigate} from "react-router";

type SearchBlockProps = {
    search?: string | null,
    onSearchChange?: (search: string | null) => void,
    settlementRef?: string | null,
    onSettlementChange?: (settlement: ISettlement | null) => void,
    onLoadingChange?: (loading: boolean) => void,
}

const SearchBlock: FC<SearchBlockProps> = ({ search, onSearchChange, onSettlementChange, settlementRef, onLoadingChange}) => {
    const { data: areas } = useGetAreasQuery();
    const {data: settlements, isLoading: isSettlementsLoading} = useGetSettlementsQuery();

    const [inputValue, setInputValue] = useState(search ?? "");
    const [selectedArea, setSelectedArea] = useState<IArea | null>(null);
    const [selectedSettlement, setSelectedSettlement] = useState<ISettlement | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const isAdvertisementsPage = location.pathname.startsWith("/advertisements");

    useEffect(() => {
        if (!settlements || !settlementRef) return;

        const foundSettlement = settlements.find(s => s.ref === settlementRef);
        if (!foundSettlement) return;

        setSelectedSettlement(foundSettlement);

        const areaOfSettlement = areas?.find(a => a.ref === foundSettlement.area) || null;
        setSelectedArea(areaOfSettlement);
    }, [settlementRef, settlements, areas]);

    useEffect(() => {
        setInputValue(search ?? "");
    }, [search]);

    useEffect(() => {
        onLoadingChange?.(isSettlementsLoading);
    }, [isSettlementsLoading, onLoadingChange]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearchSubmit();
    };

    const handleSearchSubmit = () => {
        const value = inputValue.trim() || null;

        const params = buildParams(value, settlementRef)

        handleNavigateOrUpdate(params, () => onSearchChange?.(value));
    };

    const handleSettlementChange = (settlement: ISettlement | null) => {
        setSelectedSettlement(settlement);

        const ref = settlement?.ref ?? null;
        const value = inputValue.trim() || null;

        const params = buildParams(value, ref);

        handleNavigateOrUpdate(params, () => onSettlementChange?.(settlement));
    };

    const handleNavigateOrUpdate = (params: URLSearchParams, callback?: () => void) => {
        if (isAdvertisementsPage) {
            callback?.();
            return;
        }

        navigate(`/advertisements?${params.toString()}`);
    }

    const buildParams = (search?: string | null, settlementRef?: string | null) => {
        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (settlementRef) params.set("settlementRef", settlementRef);

        return params;
    };

    return (
        <div className="mt-[57px] w-full max-w-[1430px] flex gap-9 h-[54px]">
            {areas && settlements && (
                <>
                    <div className="flex flex-row items-center gap-4 px-4 w-[981px] h-[48px] rounded-[5px] border-[2px] border-[rgba(0,23,72,0.58)] box-border">
                        <img
                            src={SearchIcon}
                            alt="icon"
                            className="w-[30px] h-[30px] flex-none"
                            onClick={handleSearchSubmit}
                        />

                        <input
                            type="text"
                            placeholder="Що шукаєте?"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none font-inter text-[16px] leading-[19px] text-[rgba(0,23,72,0.8)] placeholder:text-[rgba(0,23,72,0.58)]"
                        />
                    </div>

                    <AreasDropDown
                        areas={areas}
                        settlements={settlements}
                        isLoading={isSettlementsLoading}
                        selectedArea={selectedArea}
                        selectedSettlement={selectedSettlement}
                        onSelectArea={(area) => {
                            setSelectedArea(area);
                            setSelectedSettlement(null);
                        }}
                        onSelectSettlement={handleSettlementChange}
                    />
                </>
            )}
        </div>
    );
};

export default SearchBlock;