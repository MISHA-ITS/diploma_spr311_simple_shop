import {Link, useNavigate} from "react-router-dom";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import * as React from "react";
import {ChevronLeftIcon} from "../icons";
import {useAppDispatch, useAppSelector} from "../store";
import {logout} from "../store/authSlice.ts";

const SimpleHeader: React.FC = () => {

    const {user} = useAppSelector(globalState => globalState.auth);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            localStorage.removeItem("token"); // або localStorage.clear()
            dispatch(logout());
            navigate("/signin");
        } catch (error) {
            console.log("Logout error", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-lg font-semibold text-gray-800 dark:text-white"
                >
                    OLX™
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <ThemeToggleButton />

                    {/* ❌ Не залогінений */}
                    {!user && (
                        <Link
                            to="/signin"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Вхід
                        </Link>
                    )}

                    {/* ✅ Залогінений USER */}
                    {user && !user.roles.includes("Admin") && (
                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                            Вихід
                        </button>
                    )}

                    {/* 👑 Залогінений ADMIN */}
                    {user && user.roles.includes("Admin") && (
                        <Link
                            to="/admin"
                            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <ChevronLeftIcon className="size-5" />
                            Панель адміністратора
                        </Link>
                    )}
                </div>

            </div>
        </header>

    );
};

export default SimpleHeader;