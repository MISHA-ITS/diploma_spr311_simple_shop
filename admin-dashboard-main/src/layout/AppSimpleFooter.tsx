import {FC} from "react";
import YoutubeIcon from "../icons/Youtube.png";
import InstagramIcon from "../icons/Instagram.png";
import TelegramIcon from "../icons/Telegram.png";

const SimpleFooter: FC = () => {
    return (
        <footer className="w-full dark:bg-[#071739] bg-[rgb(33,33,33)] text-[#F8FAFF] pt-16 pb-10 relative">

            <div className="absolute top-0 left-0 w-full h-[22px] bg-[#E3C39D]"></div>

            <div className="max-w-[1400px] mx-auto px-6 pt-[22px]">
                <div className="flex justify-between items-center mb-16">
                    <div className="text-2xl font-semibold tracking-wide">
                        SELLIX
                    </div>

                    <div className="flex gap-8 items-center">
                        <img
                            src={YoutubeIcon}
                            alt="Facebook"
                            className="w-[31px] h-[25px] object-contain cursor-pointer hover:opacity-80 transition"
                        />
                        <img
                            src={InstagramIcon}
                            alt="Instagram"
                            className="w-[29px] h-[29px] object-contain cursor-pointer hover:opacity-80 transition"
                        />
                        <img
                            src={TelegramIcon}
                            alt="Telegram"
                            className="w-[41px] h-[27px] object-contain cursor-pointer hover:opacity-80 transition"
                        />
                    </div>
                </div>

                {/* решта футера */}
                <div className="mb-16">
                    <h3 className="text-[20px] font-semibold mb-10">
                        З підпискою доступні спеціальні пропозиції
                    </h3>

                    <div className="grid grid-cols-4 gap-12">
                        <div>
                            <h4 className="text-[16px] mb-5">Про компанію</h4>
                            <ul className="space-y-3 text-[14px] font-light">
                                <li>Про нас</li>
                                <li>Конфіденційність</li>
                                <li>Умови користування</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[16px] mb-5">Для користувачів</h4>
                            <ul className="space-y-3 text-[14px] font-light">
                                <li>Оплата і доставка</li>
                                <li>Питання та відповіді</li>
                                <li>Контакти</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[16px] font-inter mb-5">Інформація</h4>
                            <ul className="space-y-3 text-[14px] font-light">
                                <li>Замовлення</li>
                                <li>Дані</li>
                                <li>Підписки</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[16px] mb-5">Зв’яжіться з нами</h4>
                            <ul className="space-y-3 text-[14px] font-inter">
                                <li>097 165 78 88</li>
                                <li>098 665 22 12</li>
                                <li>067 134 89 07</li>
                            </ul>
                        </div>

                    </div>
                </div>

                <div className="flex justify-center items-center gap-3 text-[20px] font-extralight">
                    <div className="w-6 h-6 border border-[#F8FAFF] rounded-full flex items-center justify-center text-[16px] pb-1">
                        c
                    </div>
                    <span>2026 Sellix</span>
                </div>
            </div>
        </footer>
    )
}

export default SimpleFooter;