import { useMemo, useState } from "react";
import {AdvertisementsTab, Props} from "../types.ts";
import EnvConfig from "../../../config/env.ts";
import {useNavigate} from "react-router";

const AdvertisementsSection = ({ advertisements }: Props) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<AdvertisementsTab>("all");

    // ===============================
    // 📊 COUNTERS
    // ===============================

    const counters = useMemo(() => ({
        all: advertisements.length,

        active: advertisements.filter(
            ad => ad.isApproved && ad.isActive && !ad.isBlocked
        ).length,

        waiting: advertisements.filter(
            ad => !ad.isApproved && !ad.isBlocked
        ).length,

        inactive: advertisements.filter(
            ad => ad.isApproved && !ad.isActive && !ad.isBlocked
        ).length,

        rejected: advertisements.filter(
            ad => ad.isBlocked
        ).length,
    }), [advertisements]);

    // ===============================
    // 🔎 FILTER
    // ===============================

    const filteredAds = useMemo(() => {
        switch (activeTab) {
            case "active":
                return advertisements.filter(
                    ad => ad.isApproved && ad.isActive && !ad.isBlocked
                );

            case "waiting":
                return advertisements.filter(
                    ad => !ad.isApproved && !ad.isBlocked
                );

            case "inactive":
                return advertisements.filter(
                    ad => ad.isApproved && !ad.isActive && !ad.isBlocked
                );

            case "rejected":
                return advertisements.filter(
                    ad => ad.isBlocked
                );

            default:
                return advertisements;
        }
    }, [advertisements, activeTab]);

    const tabs: { key: AdvertisementsTab; label: string }[] = [
        { key: "all", label: "Всі" },
        { key: "active", label: "Активні" },
        { key: "waiting", label: "Очікуючі" },
        { key: "inactive", label: "Неактивні" },
        { key: "rejected", label: "Відхилені" },
    ];

    const urlAdImage = `${EnvConfig.API_URL}/images/advertisements`;

    return (
        <div>

            {/* ===============================
                 TABS
            =============================== */}

            <div className="flex gap-6 text-sm mb-6 border-b pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-2 font-medium transition ${
                            activeTab === tab.key
                                ? "text-black border-b-2 border-black"
                                : "text-gray-400 hover:text-black"
                        }`}
                    >
                        {tab.label} ({counters[tab.key]})
                    </button>
                ))}
            </div>

            {/* ===============================
                 CONTENT
            =============================== */}

            {filteredAds.length === 0 ? (
                <div className="text-center mt-10 text-gray-500">
                    Оголошення відсутні
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredAds.map(ad => (
                        <div
                            key={ad.id}
                            onClick={() => navigate(`/advertisement/${ad.id}`)}
                            className="border rounded-lg bg-white overflow-hidden hover:shadow-md transition"
                        >
                            {/* IMAGE */}
                            <div className="h-32 bg-gray-100">
                                {ad.images?.length > 0 ? (
                                    <img
                                        src={`${urlAdImage}/400_${ad.images[0]}`}
                                        alt={ad.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
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
    );
};

export default AdvertisementsSection;