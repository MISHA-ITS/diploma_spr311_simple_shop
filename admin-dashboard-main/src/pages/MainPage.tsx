import * as React from "react";
import {Link} from "react-router";
import {ChevronLeftIcon} from "../icons";

const MainPage : React.FC = () => {
    return (
        <>
        <div className="w-full max-w-md pt-10 mx-auto">
            <Link
                to="/admin"
                className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
                <ChevronLeftIcon className="size-5" />
                Панель адміністратора
            </Link>
        </div>
            <div>
                <img
                    src="https://s.dou.ua/img/static/companies/olx_logo_black__white.png"
                    alt="Logo"
                    style={{ display: 'block', margin: '0 auto', transform: 'scale(0.9)', width: '50%', height: 'auto' }}
                />
                <p style={{textAlign:'center'}}>DIPLOMA-PROJECT</p>
            </div>
        </>

    )
}

export default MainPage;