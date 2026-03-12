import {Link} from "react-router-dom";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import * as React from "react";
import {useAppSelector} from "../store";
import { HeartOutlined } from '@ant-design/icons';
//import { BellOutlined } from '@ant-design/icons';
import SelixLogo from "../icons/Sellix.png";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import LogoutIconLight from "../icons/Logout.png"
import LogoutIconDark from "../icons/LogoutGray.png"
import {logout} from "../store/authSlice.ts";
import {useLocation, useNavigate} from "react-router";
import EnvConfig from "../config/env.ts";

const SimpleHeader: React.FC = () => {
    const { user } = useAppSelector(globalState => globalState.auth);

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    }

    const currentPage: 'profile' | 'favorites' | null =
        location.pathname.startsWith("/profile")
            ? "profile"
            : location.pathname.startsWith("/favorites")
                ? "favorites"
                : null;

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 bg-[rgb(33,33,33)] h-[102px] 
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
                            {/*<Link*/}
                            {/*    to="/"*/}
                            {/*    className="flex items-center mr-5 gap-2 text-[rgb(245,245,245)] hover:opacity-80"*/}
                            {/*>*/}
                            {/*    <span className="text-[22px]">*/}
                            {/*        <BellOutlined />*/}
                            {/*    </span>*/}
                            {/*    <span className="text-[15px] font-inter">*/}
                            {/*        Сповіщення*/}
                            {/*    </span>*/}
                            {/*</Link>*/}

                            <Link
                                to="profile/"
                                className="flex items-center mr-5 gap-2 text-[rgb(245,245,245)] hover:opacity-80"
                            >
                                <img
                                    src={`${EnvConfig.API_URL}/images/users/50_${user.image}`}
                                    alt="profile"
                                    className="w-[22px] h-[22px] rounded-full object-cover"
                                />
                                <span className={`text-[15px] font-inter transition-all duration-200 ${currentPage === 'profile' ? 'font-semibold' : ''}`}>
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
                                <span className={`text-[15px] font-inter transition-all duration-200 ${currentPage === 'favorites' ? 'font-semibold' : ''}`}>
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
                            <button onClick={handleLogout} className="inline-flex min-h-[37.42px] items-center justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-inter text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 gap-2">
                                <img src={LogoutIconLight} alt="Logout" className="w-5 h-5 object-contain hidden dark:inline-block" />
                                <img src={LogoutIconDark} alt="Logout" className="w-5 h-5 object-contain dark:hidden " />
                            </button>
                        </>
                    )}

                    <ThemeToggleButton />

                    {!user && (
                        <Link
                            to="/signin"
                            className="rounded-md bg-gray-200 px-6 py-2.5 text-sm font-inter text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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