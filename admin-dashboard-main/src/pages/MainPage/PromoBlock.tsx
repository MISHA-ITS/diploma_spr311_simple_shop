import React from "react";
import GooglePlayIcon from "../../icons/GooglePlay.png";
import AppStoreIcon from "../../icons/AppStore.png";

const PromoBlock: React.FC = () => {
    return (
        <div className="mt-[100px] w-full flex justify-center bg-[#212121] dark:bg-[#071739] px-6 py-10">
            <div className="flex w-full max-w-[1209px] justify-between items-center gap-4">
                <p className="flex-1 min-w-[240px] text-[24px] font-inter text-[#F5F5F5]">
                    Купуй ті речі, які тобі справді потрібні!
                </p>

                <div className="flex flex-col items-center gap-2 min-w-[366px]">
                    <div className="flex gap-4">
                        <img src={GooglePlayIcon} alt="Google Play" className="h-[50px]" />
                        <img src={AppStoreIcon} alt="App Store" className="h-[50px]" />
                    </div>
                    <p className="text-[16px] font-inter text-[#F5F5F5] text-center">
                        Безкоштовний застосунок на твій телефон
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PromoBlock;