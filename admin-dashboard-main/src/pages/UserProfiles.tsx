import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
//import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import type {IUserItem} from "./Users/types.ts";
import * as React from "react";
import EnvConfig from "../config/env.ts";

const urlUser = `${EnvConfig.API_URL}/api/User/Get?id`;

const UserProfiles: React.FC = () => {

    const { id } = useParams<{id:string}>();
    const [user, setUser] = useState<IUserItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        fetch(`${urlUser}=${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("User not found");
                }
                return res.json();
            })
            .then(res => {
                console.log("API RESPONSE:", res);
                setUser(res.payload);
            })
            .catch(err => {
                console.error(err);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Завантаження…</div>;
    if (!user) return <div>Користувача не знайдено</div>;

    return (
        <>
            <PageMeta
                title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Профіль користувача" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <UserMetaCard user={user} />
                    <UserInfoCard user={user} />
                    {/* <UserAddressCard /> */}
                </div>
            </div>
        </>
    );
}

export default UserProfiles;
