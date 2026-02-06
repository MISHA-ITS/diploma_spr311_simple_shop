import {Link} from "react-router-dom";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import * as React from "react";
import {useAppSelector} from "../store";
import { UserOutlined, BellOutlined, HeartOutlined } from '@ant-design/icons';

const SimpleHeader: React.FC = () => {

    const {user} = useAppSelector(globalState => globalState.auth);

    return (
        <header className="sticky top-0 z-50 w-full bg-[rgb(33,33,33)] dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-[36px] ml-50 font-inter uppercase text-[rgb(245,245,245)] dark:text-white"
                >
                    SELLIX
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {user && 
                        (
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
                                to="/"
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
                                to="/"
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
                                to="/"
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-inter text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
        </header>

    );
};

export default SimpleHeader;