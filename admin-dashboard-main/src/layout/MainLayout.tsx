import React from "react";
import { Outlet } from "react-router-dom";
import AppSimpleHeader from "./AppSimpleHeader.tsx";

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F5F5F5]">

            {/* Header */}
            <AppSimpleHeader />

            {/* Основний контент */}
            <main className="bg-[#F5F5F5] flex-1 p-6 rounded-lg shadow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-black/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500 text-center">
                    © {new Date().getFullYear()} - «OLX™»
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;