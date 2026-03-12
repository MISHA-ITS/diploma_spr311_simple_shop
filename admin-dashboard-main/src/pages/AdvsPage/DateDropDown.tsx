import {FC} from "react";
import moreIcon from "../../icons/More.png";
import {DateFilter} from "./types.ts";

type DateDropDownProps = {
    date?: DateFilter | null;
    onDateChange: (date: DateFilter | null) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const dateLabels: Record<DateFilter, string> = {
    today: "Сьогодні",
    week: "За тиждень",
    month: "За місяць",
};

const DateDropDown: FC<DateDropDownProps> = ({ date, onDateChange, isOpen, onToggle }) => {
    const currentDate = date ? dateLabels[date] : "Час публікації";

    const handleDateSelect = (newDate: DateFilter | null)=> {
        onToggle();
        onDateChange(newDate);
    }
    return (
        <div className="relative w-fit">

            <button
                className="flex justify-center items-center px-4 py-3 gap-6 w-[181px] h-[48px] border-2 border-[rgba(0,23,72,0.58)] rounded-[5px]"
                onClick={() => onToggle()}
            >
                <span className="font-inter font-normal text-[16px] leading-[19px] text-[rgba(7,23,57,0.5)] shrink-0">
                    {currentDate}
                </span>

                <img
                    src={moreIcon}
                    alt="More"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>



            {isOpen &&
                <ul className="absolute top-full left-0 mt-1 w-[181px] bg-white border-2 border-[rgba(0,23,72,0.58)] rounded-[5px] shadow-lg z-40 divide-y divide-gray-200">
                    <li
                        className="px-4 py-3 hover:bg-gray-100 font-inter cursor-pointer"
                        onClick={() => handleDateSelect(null)}
                    >
                        За весь час
                    </li>

                    {Object.entries(dateLabels).map(([key, label]) => (
                        <li
                            key={key}
                            className="px-4 py-3 hover:bg-gray-100 font-inter cursor-pointer"
                            onClick={() => handleDateSelect(key as DateFilter)}
                        >
                            {label}
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}

export default DateDropDown;