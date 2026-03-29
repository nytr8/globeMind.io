import React from "react";
import {
  FiLayers,
  FiClock,
  FiShare2,
  FiSettings,
  FiBatteryCharging,
} from "react-icons/fi";
import { LuBrainCircuit } from "react-icons/lu";
const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#0A0D14] border-r border-slate-800/50 flex flex-col justify-between hidden md:flex">
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
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600/10 text-blue-500 font-medium transition-colors"
            >
              <FiLayers size={18} />
              All Items
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors group"
            >
              <FiClock
                size={18}
                className="group-hover:text-white transition-colors"
              />
              Recent
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors group"
            >
              <FiShare2
                size={18}
                className="group-hover:text-white transition-colors"
              />
              Knowledge Graph
            </a>
          </nav>
        </div>
      </div>

      <div className="px-4 py-6 border-t border-slate-800/50">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group border border-slate-700/60">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Alex Chen"
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                Alex Chen
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
