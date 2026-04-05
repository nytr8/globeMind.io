import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../items/components/Sidebar";
import Topbar from "../../items/components/Topbar";

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-[#0A0D14] font-sans selection:bg-blue-500/30 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen md:ml-64">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
