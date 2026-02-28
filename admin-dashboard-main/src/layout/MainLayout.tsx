import React from "react";
import { Outlet } from "react-router-dom";
import AppSimpleHeader from "./AppSimpleHeader.tsx";
import AppSimpleFooter from "./AppSimpleFooter.tsx";

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F5F5F5]">

            <AppSimpleHeader />

            <main className="bg-[#F5F5F5] pt-[91px] flex-1 rounded-lg shadow">
                <Outlet />
            </main>

            <AppSimpleFooter />
        </div>
    );
};

export default MainLayout;