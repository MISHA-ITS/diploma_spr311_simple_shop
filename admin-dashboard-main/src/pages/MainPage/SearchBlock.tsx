import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import LocationIcon from "../../icons/Location.png";
import MoreIcon from "../../icons/More.png";

const SearchBlock: React.FC = () => {
    return (
        <div className="mt-[57px] w-full max-w-[1430px] px-4 flex gap-9 h-[54px]">
            <div className="flex flex-1 min-w-[800px] h-full rounded-[5px] border border-[#6C6C6C] bg-[#AEAEAE] px-4 gap-4 items-center">
                <SearchOutlined className="text-[25px] text-[#6C6C6C]" />
                <span className="text-[16px] font-inter text-[#212121] truncate">
                    Що шукаєте?
                </span>
            </div>

            <div className="flex items-center w-[413px] h-full rounded-[5px] border border-[#6C6C6C] bg-[#AEAEAE] px-4">
                <div className="flex items-center gap-4">
                    <img src={LocationIcon} alt="icon" className="w-[25px] h-[30px]" />
                    <span className="text-[16px] font-inter text-[#212121] truncate">
                        Вся Україна
                    </span>
                </div>

                <img src={MoreIcon} alt="arrow" className="w-[28px] h-[12px] ml-auto" />
            </div>
        </div>
    );
};

export default SearchBlock;