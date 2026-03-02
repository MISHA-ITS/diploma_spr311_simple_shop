import {FC, useState} from "react";
import SearchIcon from "../../icons/Search.png";
import {useGetAreasQuery, useGetSettlementsQuery} from "../../services/apiNewPost.ts";
import {IArea, ISettlement} from "../../models/newPost.ts";
import AreasDropDown from "./AreasDropDown.tsx";

const SearchBlock: FC = () => {
    const { data: areas } = useGetAreasQuery();
    const {data: settlements, isLoading } = useGetSettlementsQuery();

    const [searchValue, setSearchValue] = useState("");

    const [selectedArea, setSelectedArea] = useState<IArea | null>(null);
    const [selectedSettlement, setSelectedSettlement] = useState<ISettlement | null>(null);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }

    return (
        <div className="mt-[57px] w-full max-w-[1430px] flex gap-9 h-[54px]">
            <div className="flex flex-row items-center gap-4 px-4 w-[981px] h-[48px] rounded-[5px] border-[2px] border-[rgba(0,23,72,0.58)] box-border">
                <img
                    src={SearchIcon}
                    alt="icon"
                    className="w-[30px] h-[30px] flex-none"
                />

                <input
                    type="text"
                    placeholder="Що шукаєте?"
                    value={searchValue}
                    onChange={handleChange}
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
                    onSelectSettlement={(settlement) => setSelectedSettlement(settlement)}
                />
            )}
        </div>
    );
};

export default SearchBlock;