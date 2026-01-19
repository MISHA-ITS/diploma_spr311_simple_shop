import PageBreadcrumb from "../components/common/PageBreadCrumb";
//import UserMetaCard from "../components/UserProfile/UserMetaCard";
//import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import * as React from "react";
import {useProfileQuery} from "../services/apiAccount.ts";

const Profile: React.FC = () => {

    //Автоматично посилає запит на сервер
    const {data: userProfile} = useProfileQuery();
    console.log("Profile", userProfile);

    return (
        <>
            <PageMeta
                title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Profile" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Профіль користувача
                </h3>
                <div className="space-y-6">
                    {/*<UserMetaCard user={userProfile} />*/}
                    {/*<UserInfoCard user={userProfile} />*/}
                </div>
            </div>
        </>
    );
}

export default Profile;
