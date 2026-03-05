import PageMeta from "../components/common/PageMeta";
import { useProfileQuery } from "../services/apiAccount";
import { useGetMyAdvertisementsQuery } from "../services/apiAdvertisement";
import { useGetMyBuyerOrdersQuery, useGetMySellerOrdersQuery } from "../services/apiOrder";
import { useState } from "react";
import AdvertisementsSection from "./Advertisement/components/AdvertisementsSection.tsx";
import DeliverySection from "./Order/DeliverySection.tsx";
import ProfileSection from "./ProfileSection.tsx";

const Profile = () => {
    const { data: profileData, isLoading: profileLoading } = useProfileQuery();
    const { data: adsData } = useGetMyAdvertisementsQuery();
    const { data: buyerOrders } = useGetMyBuyerOrdersQuery();
    const { data: sellerOrders } = useGetMySellerOrdersQuery();

    const [mainTab, setMainTab] = useState<"ads" | "delivery" | "myProfile">("ads");

    if (profileLoading) return <div className="p-10">Завантаження...</div>;
    if (!profileData?.payload) return <div className="p-10">Помилка профілю</div>;
    const user = profileData.payload;
    console.log(user);

    return (
        <>
            <PageMeta title="Profile" description="User profile page" />

            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold">
                        Привіт {user.firstName}!
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {profileData.payload.phoneNumber}
                    </p>
                </div>

                {/* MAIN TABS */}
                <div className="flex justify-center gap-10 text-gray-600 mb-8">
                    <button
                        onClick={() => setMainTab("ads")}
                        className={mainTab === "ads" ? "text-black border-b-2 border-black pb-1 font-medium" : "hover:text-black"}
                    >
                        Оголошення
                    </button>

                    <button
                        onClick={() => setMainTab("delivery")}
                        className={mainTab === "delivery" ? "text-black border-b-2 border-black pb-1 font-medium" : "hover:text-black"}
                    >
                        Sellix Доставка
                    </button>

                    <button
                        onClick={() => setMainTab("myProfile")}
                        className={
                            mainTab === "myProfile"
                                ? "text-black border-b-2 border-black pb-1 font-medium"
                                : "hover:text-black"
                        }
                    >
                        Мій профіль
                    </button>
                </div>

                {mainTab === "ads" && (
                    <AdvertisementsSection advertisements={adsData?.payload ?? []} />
                )}

                {mainTab === "delivery" && (
                    <DeliverySection
                        buyerOrders={buyerOrders?.payload ?? []}
                        sellerOrders={sellerOrders?.payload ?? []}
                    />
                )}

                {mainTab === "myProfile" && (
                    <ProfileSection user={user} />
                )}
            </div>
        </>
    );
};

export default Profile;