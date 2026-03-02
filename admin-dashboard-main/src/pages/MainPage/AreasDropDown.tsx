import {FC, useMemo, useState} from "react";
import { IArea, ISettlement } from "../../models/newPost.ts";
import LocationIcon from "../../icons/Location.png";
import MoreIcon from "../../icons/More.png";

type AreasDropDownProps = {
    areas: IArea[];
    settlements: ISettlement[];
    isLoading: boolean;
    selectedArea?: IArea | null;
    selectedSettlement?: ISettlement | null;
    onSelectArea: (area: IArea | null) => void;
    onSelectSettlement: (settlement: ISettlement) => void;
};

const AreasDropDown: FC<AreasDropDownProps> = ({areas, settlements, isLoading, selectedArea, selectedSettlement, onSelectArea, onSelectSettlement, }) => {
    const [isOpen, setIsOpen] = useState(false);

    const filteredSettlements = useMemo(() => {
        if (!selectedArea || !settlements) return [];

        return settlements
            .filter(s => s.area === selectedArea.ref)
            .slice()
            .sort((a, b) =>
                a.description.localeCompare(b.description, "uk")
            );

    }, [selectedArea, settlements]);

    const handleAreaSelect = (area: IArea) => {
        if (isLoading) return;
        onSelectArea(area);
        setIsOpen(true);
    };

    const handleSettlementSelect = (settlement: ISettlement) => {
        onSelectSettlement(settlement);
        setIsOpen(false);
    };

    const handleBack = () => {
        onSelectArea(null);
    };

    const headerText = selectedArea
        ? selectedSettlement
            ? `${selectedArea.description}, ${selectedSettlement.description}`
            : selectedArea.description
        : "Вся Україна";

    return (
        <div className="relative w-[413px]" >
            <div
                className="flex flex-row items-center gap-4 pl-6 pr-4 py-4 w-full h-[48px] rounded-[5px] border-[2px] border-[rgba(0,23,72,0.58)] box-border cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img
                    src={LocationIcon}
                    alt="icon"
                    className="w-[21px] h-[26px]"
                />

                <span className="flex-1 truncate text-[16px] font-inter text-[rgba(0,23,72,0.58)]">
                    {headerText}
                </span>

                <img
                    src={MoreIcon}
                    alt="arrow"
                    className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </div>


            {isOpen && (
                <ul className="absolute rounded-[5px] border-[2px] border-[rgba(0,23,72,0.58)] box-border mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-40 max-h-60 overflow-auto divide-y divide-gray-200 scrollbar-hidden">
                    {!selectedArea && (
                        <>
                            <li
                                onClick={() => {
                                    onSelectArea(null);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-3 hover:bg-gray-100 font-inter cursor-pointer font-medium"
                            >
                                Вся Україна
                            </li>

                            {areas.map((area) => (
                                <li
                                    key={area.ref}
                                    onClick={() => handleAreaSelect(area)}
                                    className="px-4 py-3 hover:bg-gray-100 font-inter cursor-pointer flex items-center justify-between"
                                >
                                    <span>{area.description}</span>
                                    <img
                                        src={MoreIcon}
                                        alt="arrow"
                                        className="rotate-270"
                                    />
                                </li>
                            ))}
                        </>
                    )}

                    {selectedArea && (
                        <>
                            <li
                                onClick={handleBack}
                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer font-medium flex items-center gap-2"
                            >
                                <img src={MoreIcon} alt="arrow" className="rotate-90" />
                                <span>Назад до областей</span>
                            </li>

                            {filteredSettlements.map(settlement => (
                                <li
                                    key={settlement.ref}
                                    className="px-4 py-3 hover:bg-gray-100 font-inter cursor-pointer"
                                    onClick={() => handleSettlementSelect(settlement)}
                                >
                                    {settlement.description}
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            )}
        </div>
    );
};

export default AreasDropDown;