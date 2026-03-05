import React from "react";
import { IoReloadCircleSharp } from "react-icons/io5";

// Заміни на свій шлях до типів
interface Props {
    count: number;
    children: React.ReactNode;
    onRefresh: () => void;
}

const AdvertisementCard: React.FC<Props> = ({ count, children, onRefresh }) => {
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    const handleRefreshClick = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        if (onRefresh) onRefresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-blue-500/5 overflow-hidden border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between px-6 py-5 border-b border-blue-50 dark:border-blue-900/20 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10">
                <div>
                    <h2 className="text-2xl font-black text-neutral-800 dark:text-white tracking-tight">
                        Оголошення
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {count} активних записів
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefreshClick}
                        className="group p-2 rounded-2xl text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                    >
                        <IoReloadCircleSharp
                            size={32}
                            className={isRefreshing ? "animate-spin-once" : ""}
                        />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                {children}
            </div>
        </div>
    )
}

export default AdvertisementCard;