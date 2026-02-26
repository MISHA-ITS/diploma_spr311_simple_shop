import PageMeta from "../components/common/PageMeta";
import { useProfileQuery } from "../services/apiAccount";
import { useState } from "react";

const Profile = () => {
    const { data, isLoading } = useProfileQuery();

    const [activeTab, setActiveTab] = useState("active");

    if (isLoading) return <div className="p-10">Завантаження...</div>;
    if (!data?.payload) return <div className="p-10">Помилка завантаження</div>;

    const user = data.payload;

    return (
        <>
            <PageMeta title="Profile" description="User profile page" />

            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold">
                        Привіт {user.firstName}!
                    </h1>
                    <p className="text-gray-500 mt-2">{user.phoneNumber}</p>
                </div>

                {/* MAIN MENU */}
                <div className="flex justify-center gap-10 text-gray-600 mb-8">
                    <button className="font-medium text-black border-b-2 border-black pb-1">
                        Оголошення
                    </button>
                    <button className="hover:text-black">Шукаю роботу</button>
                    <button className="hover:text-black">Рейтинг</button>
                    <button className="hover:text-black">Sellix Доставка</button>
                </div>

                {/* TABS */}
                <div className="flex gap-6 text-sm mb-6 border-b pb-3">
                    {[
                        { key: "active", label: "Активні" },
                        { key: "waiting", label: "Очікуючі" },
                        { key: "inactive", label: "Неактивні" },
                        { key: "unpaid", label: "Неоплачені" },
                        { key: "rejected", label: "Відхилені" },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-2 ${
                                activeTab === tab.key
                                    ? "text-black border-b-2 border-black"
                                    : "text-gray-400"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="flex flex-wrap gap-4 mb-12">
                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-sm">
                        Фільтри
                    </button>

                    <input
                        placeholder="Пошук"
                        className="px-4 py-2 bg-gray-200 rounded-lg text-sm w-60"
                    />

                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-sm">
                        Категорія
                    </button>

                    <button className="px-4 py-2 bg-gray-200 rounded-lg text-sm">
                        Час публікації
                    </button>
                </div>

                {/* EMPTY STATE */}
                <div className="flex flex-col items-center text-center mt-20">
                    <div className="w-20 h-20 bg-gray-200 rounded-md mb-6" />

                    <p className="font-medium mb-2">
                        Активні оголошення відображаються тут до закінчення їх терміну дії
                    </p>

                    <p className="text-sm text-gray-500 mb-6">
                        Ці оголошення доступні для перегляду всім і стануть неактивними через 30 днів після їх активації.
                    </p>

                    <button className="px-6 py-3 bg-black text-white rounded-lg">
                        Створити оголошення
                    </button>
                </div>

            </div>
        </>
    );
};

export default Profile;
