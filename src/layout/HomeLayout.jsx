import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SideBar, Navbar, Header } from "../components";

function HomeLayout() {
    const location = useLocation();

    const isAuthPage = location.pathname === "/auth";

    return (
        <div className="min-h-screen flex flex-col sm:flex-row overflow-hidden">
            {!isAuthPage && (
                <div className="hidden sm:block sm:w-64">
                    <SideBar />
                </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                {!isAuthPage && (
                    <div className="sm:hidden">
                        <Navbar />
                    </div>
                )}

                <div className="p-4 sm:p-2 flex-1 overflow-auto">
                    <Header />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default HomeLayout;
