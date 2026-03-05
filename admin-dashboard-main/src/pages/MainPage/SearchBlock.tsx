import {FC, useEffect, useState} from "react";
import SearchIcon from "../../icons/Search.png";
import {useGetAreasQuery, useGetSettlementsQuery} from "../../services/apiNewPost.ts";
import {IArea, ISettlement} from "../../models/newPost.ts";
import AreasDropDown from "./AreasDropDown.tsx";
import {useLocation, useNavigate} from "react-router";

type SearchBlockProps = {
    search: string | null,
    onSearchChange: (search: string | null) => void,
    settlementRef: string | null,
    onSettlementChange: (settlement: ISettlement | null) => void,
}

const SearchBlock: FC<SearchBlockProps> = ({ search, onSearchChange, onSettlementChange, settlementRef}) => {
    const { data: areas } = useGetAreasQuery();
    const {data: settlements, isLoading } = useGetSettlementsQuery();

    const [inputValue, setInputValue] = useState(search ?? "");
    const [selectedArea, setSelectedArea] = useState<IArea | null>(null);
    const [selectedSettlement, setSelectedSettlement] = useState<ISettlement | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!settlements) return;

        if (!settlementRef) {
            setSelectedSettlement(null);
            setSelectedArea(null);
            return;
        }

        const foundSettlement = settlements.find(s => s.ref === settlementRef) || null;
        setSelectedSettlement(foundSettlement);

        if (foundSettlement) {
            const areaOfSettlement = areas?.find(a => a.ref === foundSettlement.area) || null;
            setSelectedArea(areaOfSettlement);
        } else {
            setSelectedArea(null);
        }
    }, [settlementRef, settlements, areas]);

    useEffect(() => {
        setInputValue(search ?? "");
    }, [search]);

    const handleSearchSubmit = () => {
        const value = inputValue.trim() || null;

        const params = new URLSearchParams();
        if (value) params.set("search", value);

        const isAdvertisementsPage = location.pathname.startsWith("/advertisements");

        if (isAdvertisementsPage) {
            onSearchChange(value);
        } else {
            navigate(`/advertisements?${params.toString()}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };

    const handleSettlementChange = (settlement: ISettlement | null) => {
        setSelectedSettlement(settlement);

        const ref = settlement?.ref ?? null;
        const params = new URLSearchParams();

        if (inputValue.trim()) params.set("search", inputValue.trim());
        if (ref) params.set("settlementRef", ref);

        const isAdvertisementsPage = location.pathname.startsWith("/advertisements");

        if (isAdvertisementsPage) {
            onSettlementChange(settlement);
        } else {
            navigate(`/advertisements?${params.toString()}`);
        }
    };

    return (
        <div className="mt-[57px] w-full max-w-[1430px] flex gap-9 h-[54px]">
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

            {areas && (
                <AreasDropDown
                    areas={areas}
                    settlements={settlements!}
                    isLoading={isLoading}
                    selectedArea={selectedArea}
                    selectedSettlement={selectedSettlement}
                    onSelectArea={(area) => {
                        setSelectedArea(area);
                        setSelectedSettlement(null);
                    }}
                    onSelectSettlement={(e) => handleSettlementChange(e)}
                />
            )}
        </div>
    );
};

export default SearchBlock;