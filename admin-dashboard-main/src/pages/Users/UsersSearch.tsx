import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { useState } from "react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}

const UsersSearch: React.FC<Props> = ({ value, onChange, onClear }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleToggle = () => {
        if (isVisible) {
            // ❗️ОЧИЩАЄМО ПОШУК
            onClear();
        }
        setIsVisible(p => !p);
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {isVisible && (
                <input
                    autoFocus
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Шукати..."
                    className="w-40 bg-white dark:bg-neutral-800
                        border border-blue-200 dark:border-blue-900
                        rounded-lg px-3 py-1 text-sm
                        focus:ring-2 focus:ring-blue-500 outline-none"
                />
            )}

            <button
                onClick={handleToggle}
                className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30
                    rounded-lg text-blue-500 transition"
            >
                {isVisible ? <HiXMark size={16} /> : <HiMagnifyingGlass size={16} />}
            </button>
        </div>
    );
};

export default UsersSearch;
