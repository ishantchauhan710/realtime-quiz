import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PageContainer({
    children,
    onLogout,
}: {
    children: React.ReactNode;
    onLogout?: () => void;
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const menus = [
        { label: "Solo Play", path: "/home" },
        { label: "Multiplayer", path: "/multiplayer" },
        { label: "Lobby", path: "/lobby" },
        { label: "Leaderboard", path: "/leaderboard" },
        { label: "Profile", path: "/profile" },
        { label: "My Quizzes", path: "/my-quizzes" },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">
            <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6">
                <h2 className="text-xl font-bold mb-8">Dashboard</h2>

                <nav className="flex flex-col gap-2">
                    {menus.map((item) => {
                        const active = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`text-left px-3 py-2 rounded-lg transition ${active
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                    }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded-lg"
                    >
                        Logout
                    </button>
                )}
            </aside>

            <div className="flex-1 p-6 md:p-10">{children}</div>
        </div>
    );
}