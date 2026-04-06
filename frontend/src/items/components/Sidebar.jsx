import React from "react";
import {
  FiLayers,
  FiClock,
  FiShare2,
  FiSettings,
  FiFolder,
} from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";
import { LuBrainCircuit } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="w-64 h-screen fixed bg-[#0A0D14] border-r border-slate-800/50 flex flex-col justify-between hidden md:flex overflow-hidden">
      <div>
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <LuBrainCircuit size={18} />
          </div>
          <span className="text-white text-xl font-bold tracking-wide">
            Globemind.io
          </span>
        </div>

        <div className="px-3 mt-4">
          <p className="px-3 text-xs font-semibold text-slate-500 mb-4 tracking-wider">
            LIBRARY
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-blue-600/30 text-blue-500 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              <MdSpaceDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink
              to="/allitems"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-blue-600/30 text-blue-500 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              <FiLayers size={18} />
              All Items
            </NavLink>
            {/* <NavLink
              to="/recent"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-blue-600/30 text-blue-500 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              <FiClock
                size={18}
                className="group-hover:text-white transition-colors"
              />
              Recent
            </NavLink> */}
            <NavLink
              to="/graph/getgraph"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-blue-600/30 text-blue-500 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              <FiShare2
                size={18}
                className="group-hover:text-white transition-colors"
              />
              Knowledge Graph
            </NavLink>
            <NavLink
              to="/collections"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-blue-600/30 text-blue-500 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`
              }
            >
              <FiFolder
                size={18}
                className="group-hover:text-white transition-colors"
              />
              Collections
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="px-4 py-6 border-t border-slate-800/50">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group border border-slate-700/60">
          <div className="flex items-center  gap-3">
            <CgProfile color="#155DFC" size={25} />
            <div>
              <p className="text-sm text-white group-hover:text-blue-400 transition-colors">
                {user.username}
              </p>
              {/* <p className="text-xs text-slate-500">Pro Plan</p> */}
            </div>
          </div>
          <FiSettings
            className="text-slate-500 group-hover:text-white transition-colors"
            size={16}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
