import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBackgroundClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="flex-1 flex flex-col overflow-hidden relative z-10"
        onClick={handleBackgroundClick}
      >
        <header className="md:hidden flex items-center justify-between p-4 bg-gray-50 shadow">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(true);
            }}
            className="text-gray-700 bg-indigo-100 p-2 rounded-md shadow hover:bg-indigo-200 transition"
          >
            <FaBars className="w-6 h-6" />
          </button>

          <div className="text-xl font-bold text-indigo-600">PetCare</div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
