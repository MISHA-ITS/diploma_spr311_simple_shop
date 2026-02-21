import React from "react";
import { Outlet } from "react-router-dom";
import AppSimpleHeader from "./AppSimpleHeader.tsx";
import AppSimpleFooter from "./AppSimpleFooter.tsx";

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F5F5F5]">

            {/* Header */}
            <AppSimpleHeader />


            {/* Основний контент */}
            <main className="bg-[#F5F5F5] flex-1 rounded-lg shadow">
                <Outlet />
            </main>

            <AppSimpleFooter />
        </div>
    );
};

export default MainLayout;