import {Props} from "../../../types/Category/types.ts";
import { FaPlusCircle } from "react-icons/fa";
import { IoReloadCircleSharp } from "react-icons/io5";

const UsersCard: React.FC<Props> = ({ count, children, onCreate, onRefresh }) => {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/10 dark:border-white/10">
            <div className="items-center justify-between">
                <h2 className="text-lg font-semibold">Категорії</h2>
                <div className="text-sm text-neutral-500">{count} запис(ів) </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
                <button
                    onClick={onCreate}
                    type="button"
                    data-drawer-target="drawer-form"
                    data-drawer-show="drawer-form"
                    aria-controls="drawer-form"
                    className="
                        inline-flex items-center justify-center
                        w-9 h-9 rounded-full
                        bg-emerald-600 text-white
                        hover:bg-emerald-500
                        dark:bg-emerald-500 dark:hover:bg-emerald-400

                        transition-all duration-300
                        hover:scale-110
                        active:scale-90

                        hover:shadow-xl
                        hover:ring-2 hover:ring-emerald-300
                        ring-offset-0 dark:ring-offset-neutral-900

                        leading-none
                    "
                >
                    <FaPlusCircle size={26} className="block" />
                </button>
                <div className="h-6 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-1"></div>
                <button
                    onClick={onRefresh}
                    type="button"
                    data-drawer-target="drawer-form"
                    data-drawer-show="drawer-form"
                    aria-controls="drawer-form"
                    className="
                        inline-flex items-center justify-center
                        w-9 h-9 rounded-full
                        bg-blue-700 text-white
                        hover:bg-blue-600
                        dark:bg-blue-600 dark:hover:bg-blue-500

                        transition-all duration-300
                        hover:scale-110
                        active:scale-90

                        hover:shadow-xl
                        hover:ring-2 hover:ring-blue-400
                        ring-offset-0 dark:ring-offset-neutral-900

                        leading-none
                    "
                >
                    <IoReloadCircleSharp size={30} />
                </button>
            </div>
        </div>
        {children}
    </div>
    )
}

export default UsersCard;
