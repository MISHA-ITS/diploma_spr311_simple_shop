import PageMeta from "../components/common/PageMeta";
import { useProfileQuery } from "../services/apiAccount";
import { useMemo, useState } from "react";
import { useGetMyAdvertisementsQuery } from "../services/apiAdvertisement.ts";
import { Link, useNavigate } from "react-router-dom";
import { IAdvertisement } from "./Advertisement/types.ts";
import EnvConfig from "../config/env.ts";

const Profile = () => {
    const navigate = useNavigate();

    const { data: profileData, isLoading: profileLoading } = useProfileQuery();
    const { data: adsData, isLoading: adsLoading } = useGetMyAdvertisementsQuery();

    const [activeTab, setActiveTab] = useState("active");

    const advertisements: IAdvertisement[] = adsData?.payload ?? [];

    const urlAdImage = `${EnvConfig.API_URL}/images/advertisements`;

    // ===============================
    // 📊 ЛІЧИЛЬНИКИ
    // ===============================

    const counters = useMemo(() => {
        return {
            active: advertisements.filter(ad => ad.isApproved && ad.isActive && !ad.isBlocked).length,
            waiting: advertisements.filter(ad => !ad.isApproved && !ad.isBlocked).length,
            inactive: advertisements.filter(ad => ad.isApproved && !ad.isActive && !ad.isBlocked).length,
            rejected: advertisements.filter(ad => ad.isBlocked).length,
        };
    }, [advertisements]);

    // ===============================
    // 🔎 ФІЛЬТРАЦІЯ
    // ===============================

    const filteredAds = useMemo(() => {
        switch (activeTab) {
            case "active":
                return advertisements.filter(ad => ad.isApproved && ad.isActive && !ad.isBlocked);
            case "waiting":
                return advertisements.filter(ad => !ad.isApproved && !ad.isBlocked);
            case "inactive":
                return advertisements.filter(ad => ad.isApproved && !ad.isActive && !ad.isBlocked);
            case "rejected":
                return advertisements.filter(ad => ad.isBlocked);
            default:
                return advertisements;
        }
    }, [advertisements, activeTab]);

    if (profileLoading || adsLoading)
        return <div className="p-10">Завантаження...</div>;

    if (!profileData?.payload)
        return <div className="p-10">Помилка завантаження профілю</div>;

    const user = profileData.payload;

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

                    <button className="hover:text-black transition">
                        Sellix Доставка
                    </button>
                </div>

                {/* TABS */}
                <div className="flex gap-8 text-sm mb-8 border-b pb-3">
                    {[
                        { key: "active", label: "Активні" },
                        { key: "waiting", label: "Очікуючі" },
                        { key: "inactive", label: "Неактивні" },
                        { key: "rejected", label: "Відхилені" },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-2 transition font-medium ${
                                activeTab === tab.key
                                    ? "text-black border-b-2 border-black"
                                    : "text-gray-400 hover:text-black"
                            }`}
                        >
                            {tab.label} ({counters[tab.key as keyof typeof counters]})
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredAds.map(ad => (
                            <div
                                key={ad.id}
                                onClick={() => navigate(`/advertisement/${ad.id}`)}
                                className="cursor-pointer border rounded-lg bg-white hover:shadow-md transition overflow-hidden"
                            >
                                {/* IMAGE */}
                                <div className="h-36 bg-gray-100">
                                    {ad.images?.length > 0 ? (
                                        <img
                                            src={
                                                ad.images?.length
                                                    ? `${urlAdImage}/800_${ad.images[0]}`
                                                    : "/noimage.jpeg"
                                            }
                                            alt={ad.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                            Немає фото
                                        </div>
                                    )}
                                </div>

                                {/* BODY */}
                                <div className="p-3">
                                    <h3 className="text-sm font-medium truncate">
                                        {ad.name}
                                    </h3>

                                    <p className="mt-1 text-sm font-semibold">
                                        {ad.price} грн
                                    </p>
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