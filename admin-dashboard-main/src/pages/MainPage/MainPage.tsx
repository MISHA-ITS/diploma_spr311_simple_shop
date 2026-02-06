import * as React from "react";
import {SearchOutlined} from "@ant-design/icons";
import LocationIcon from "../../icons/Location.png"
import MoreIcon from "../../icons/More.png";
import GooglePlayIcon from "../../icons/GooglePlay.png";
import AppStoreIcon from "../../icons/AppStore.png";
import CardSection from "./CardSection.tsx";


const MainPage : React.FC = () => {

    return (
        <>
            <div className="absolute top-[148px] left-[248px] flex flex-row gap-9 h-[54px] w-fit max-w-[1430px]">
                <div className="flex flex-row w-[981px] h-[54px] rounded-[5px] border border-[#6C6C6C] border-[0.1px] bg-[#AEAEAE] pt-4 pr-4 pb-4 pl-6 gap-4">
                    <SearchOutlined
                        className="text-[25px] text-[#6C6C6C]"
                    />

                    <span className=" w-[103px] h-[19px] font-inter font-normal text-[16px] leading-none tracking-normal text-[#212121] whitespace-nowrap " >
                        Що шукаєте?
                    </span>
                </div>
                <div className=" flex flex-row items-center w-[413px] h-[54px] rounded-[5px] border border-[#6C6C6C] border-[0.5px] bg-[#AEAEAE] pt-4 pr-4 pb-4 pl-6 gap-4">
                    <img
                        src={LocationIcon}
                        alt="icon"
                        className="w-[25px] h-[30px] opacity-100"
                    />

                    <span
                        className="w-[280px] h-[19px] font-inter font-normal text-[16px] leading-none tracking-normal text-[#212121] whitespace-nowrap"
                    >
                        Вся Україна
                    </span>

                    <img
                        src={MoreIcon}
                        alt="arrow"
                        className="w-[28px] h-[12px] opacity-100"
                    />
                </div>
            </div>

            <div className="absolute top-[302px] left-1/2 transform -translate-x-1/2 w-[1920px] max-w-full h-[421px] flex flex-col gap-[40px]">
                <span className="w-full h-[39px] font-inter font-bold text-[32px] leading-none tracking-normal text-center text-[#000000]">
                    Розділи у Sellix
                </span>

                {/* <CardSection categories={} /> */}
            </div>

            <div className="absolute top-[823px] left-1/2 transform -translate-x-1/2 w-[1920px] max-w-full h-[172px] flex flex-col pt-[42px] pr-[354px] pb-[42px] pl-[354px] bg-[#212121] gap-[10px]">
                <div className="w-[1209px] h-[88px] flex justify-center items-center mx-auto gap-[351px]">
                    <div className="w-[452px] h-[29px] font-inter font-normal text-[24px] leading-none text-center text-[#F5F5F5] flex items-center justify-center">
                        Купуй ті речі, які тобі справді потрібні!
                    </div>
                    <div className="w-[406px] flex flex-col items-center">
                        <div className="w-[406px] h-[52px] flex flex-row justify-between gap-[42px] items-center px-2">
                            <img
                                src={GooglePlayIcon}
                                alt="Google Play"
                                className="h-[50px] bg-[#555]">

                            </img>

                            <img
                                src={AppStoreIcon}
                                alt="App Store"
                                className="h-[50px] bg-[#777]">

                            </img>
                        </div>
                        <div className="w-[406px] h-[19px] font-inter font-normal text-[16px] leading-none text-center text-[#F5F5F5] mt-[17px]">
                            Безкоштовний застосунок на твій телефон
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}

export default MainPage;