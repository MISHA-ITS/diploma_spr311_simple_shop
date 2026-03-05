const FiltersWindow: FC = () => {
    return (
        <div className="w-[1423px] h-[638px] bg-[#EFF2F8] rounded-[5px] mx-auto mt-[40px] mb-[120px]">
            <div className="flex flex-row items-start gap-[100px] w-[1328px] h-[539px] mx-auto mt-[48px]">
                <div className="flex flex-col items-start gap-[12px] w-[257px] h-[539px] flex-none">
                    <span className="w-[257px] h-[24px] font-inter font-semibold text-[20px] leading-[24px] text-[#071739]">
                        Категорії:
                    </span>

                    <div className="flex flex-col items-start gap-[12px] w-[257px] h-[503px] flex-none">
                        <span className="w-[257px] h-[19px] font-inter font-normal text-[16px] leading-[19px] text-[#071739] self-stretch">
                            Будь яка категорія
                        </span>

                        <div className="flex flex-col items-end gap-[12px] w-[257px] h-[472px] flex-none self-stretch">
                            <div className="flex flex-row justify-between items-start w-[257px] h-[19px] gap-[154px] flex-none self-stretch">
                                <span className="font-inter font-normal text-[16px] leading-[19px] text-[#071739] flex-none">
                                    Авто
                                </span>

                                <div className="flex flex-row justify-center items-center w-[62px] h-[18px] px-[12px] py-[8px] gap-[24px] rounded-[5px] flex-none">
                                    <span className="font-inter font-light text-[14px] leading-[17px] text-[#071739] flex-none">
                                        240
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltersWindow;