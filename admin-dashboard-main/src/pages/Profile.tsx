import PageMeta from "../components/common/PageMeta";
import { useProfileQuery } from "../services/apiAccount";
import {useMemo, useState} from "react";
import {useGetMyAdvertisementsQuery} from "../services/apiAdvertisement.ts";
import {Link} from "react-router-dom";
import {IAdvertisement} from "./Advertisement/types.ts";

const Profile = () => {
    const { data: profileData, isLoading: profileLoading } = useProfileQuery();
    const { data: adsData, isLoading: adsLoading } = useGetMyAdvertisementsQuery();

    const [activeTab, setActiveTab] = useState("active");

    const advertisements: IAdvertisement[] = adsData?.payload ?? [];

    // ===============================
    // 🔎 ФІЛЬТРАЦІЯ ПО СТАТУСУ
    // ===============================

    const filteredAds = useMemo(() => {
        return advertisements.filter(ad => {
            switch (activeTab) {
                case "active":
                    return ad.isApproved && ad.isActive && !ad.isBlocked;

                case "waiting":
                    return !ad.isApproved && !ad.isBlocked;

                case "inactive":
                    return ad.isApproved && !ad.isActive && !ad.isBlocked;

                case "rejected":
                    return ad.isBlocked;

                default:
                    return true;
            }
        });
    }, [advertisements, activeTab]);

    if (profileLoading || adsLoading)
        return <div className="p-10">Завантаження...</div>;

    if (!profileData?.payload)
        return <div className="p-10">Помилка завантаження профілю</div>;

    const user = profileData.payload;

    // ===============================
    // UI
    // ===============================

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
                        { key: "rejected", label: "Відхилені" },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-2 transition ${
                                activeTab === tab.key
                                    ? "text-black border-b-2 border-black"
                                    : "text-gray-400 hover:text-black"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                {filteredAds.length === 0 ? (
                    <div className="flex flex-col items-center text-center mt-20">
                        <div className="w-20 h-20 bg-gray-200 rounded-md mb-6" />
                        <p className="font-medium mb-2">
                            Немає оголошень у цій категорії
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Створіть нове оголошення або змініть вкладку.
                        </p>
                        <Link
                            to="/create-advertisement"
                            className="px-6 py-3 bg-black text-white rounded-lg"
                        >
                            Створити оголошення
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredAds.map(ad => (
                            <div
                                key={ad.id}
                                className="border rounded-xl p-6 bg-white shadow-sm flex justify-between items-center"
                            >
                                <div className="flex gap-4 items-center">
                                    {ad.images?.length > 0 && (
                                        <img
                                            src={ad.images[0]}
                                            alt={ad.name}
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                    )}

                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {ad.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {ad.price} грн
                                        </p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-400">
                                    {ad.isBlocked
                                        ? "Відхилено"
                                        : ad.isActive
                                            ? "Активне"
                                            : "Неактивне"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </>
    );
};

export default Profile;
