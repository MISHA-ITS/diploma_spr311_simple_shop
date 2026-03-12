import { FC } from "react";
import filtersIconClosed from "../../icons/FiltersIcon.png";
import filtersIconOpen from "../../icons/FiltersIconOpen.png";

type FiltersToggleButtonProps = {
    isOpen: boolean;
    onToggle: () => void;
};

const FiltersToggleButton: FC<FiltersToggleButtonProps> = ({ isOpen, onToggle }) => {
    return (
        <button
            className={`flex justify-center items-center px-3 py-2 gap-4 w-[140px] h-[48px] rounded-[5px]
                ${isOpen ? 'bg-[#4C7ADB] border-none' : 'border-2 border-[rgba(0,23,72,0.58)] bg-transparent'}`}
            onClick={onToggle}
        >
            <div>
                <img src={isOpen ? filtersIconOpen : filtersIconClosed} alt="filters" />
            </div>

            <span className={`font-inter font-normal text-[16px] leading-[19px] 
                ${isOpen ? 'text-white' : 'text-[rgba(7,23,57,0.5)]'}`}>
                Фільтри
            </span>
        </button>
    );
};

export default FiltersToggleButton;