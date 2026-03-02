import {Link} from "react-router-dom";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import * as React from "react";
import {useAppSelector} from "../store";
import { UserOutlined, BellOutlined, HeartOutlined } from '@ant-design/icons';
import SelixLogo from "../icons/Sellix.png";
import {useEffect, useRef, useState} from "react";

const SimpleHeader: React.FC = () => {
    const { user } = useAppSelector(globalState => globalState.auth);

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 50) {
                setIsVisible(true);
                return;
            }

            if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 bg-[rgb(33,33,33)] h-[91px] 
            transition-transform duration-300 
            ${isVisible ? "translate-y-0" : "-translate-y-full"}
            dark:bg-[#071739]`}
        >
            <div className="flex pt-5 justify-between px-6 py-4">

                <Link
                    to="/"
                    className="ml-50 mr-6 pb-2 flex items-center"
                >
                    <img
                        src={SelixLogo}
                        alt="Sellix"
                        className="h-[27px] min-w-[102px] w-auto object-contain"
                    />
                </Link>

                <div className="flex items-center gap-3">
                    {user && (
                        <>
                            <Link
                                to="/"
                                className="flex items-center mr-5 gap-2 text-[rgb(245,245,245)] hover:opacity-80"
                            >
                                <span className="text-[22px]">
                                    <BellOutlined />
                                </span>
                                <span className="text-[15px] font-inter">
                                    Сповіщення
                                </span>
                            </Link>

                            <Link
                                to="profile/"
                                className="flex items-center mr-5 gap-2 text-[rgb(245,245,245)] hover:opacity-80"
                            >
                                <span className="text-[22px]">
                                    <UserOutlined />
                                </span>
                                <span className="text-[15px] font-inter">
                                    Профіль
                                </span>
                            </Link>

                            <Link
                                to="/favorites"
                                className="flex items-center mr-5 gap-2 text-[rgb(245,245,245)] hover:opacity-80"
                            >
                                <span className="text-[22px]">
                                    <HeartOutlined />
                                </span>
                                <span className="text-[15px] font-inter">
                                    Вподобані
                                </span>
                            </Link>

                            <Link
                                to="/createAdvertisement"
                                className="flex-shrink-0 min-w-[155px] inline-flex justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-inter text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                <span className="text-[15px] font-inter">
                                    Створити оголошення
                                </span>
                            </Link>
                        </>
                    )}

                    <ThemeToggleButton />

                    {!user && (
                        <Link
                            to="/signin"
                            className="rounded-md text-[17px] bg-gray-200 px-6 py-2.5 text-sm font-inter text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Увійти
                        </Link>
                    )}
                </div>
            </div>

            <div className="w-full h-[22px] bg-[#E3C39D]"></div>
        </header>
    );
};

export default SimpleHeader;