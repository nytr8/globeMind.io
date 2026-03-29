import React from "react";
import { FiBookOpen, FiVideo, FiFileText, FiGlobe } from "react-icons/fi";
import { FiTwitter } from "react-icons/fi"; // Just as an example for thread

const getBadgeConfig = (type) => {
  switch (type?.toUpperCase()) {
    case "ARTICLE":
      return {
        icon: <FiBookOpen size={12} />,
        text: "ARTICLE",
        color: "bg-black/60 text-white",
      };
    case "VIDEO":
      return {
        icon: <FiVideo size={12} />,
        text: "VIDEO",
        color: "bg-blue-900/60 text-blue-100",
      };
    case "THREAD":
      return {
        icon: <FiTwitter size={12} />,
        text: "THREAD",
        color: "bg-slate-800/60 text-slate-100",
      };
    case "WEBSITE":
      return {
        icon: <FiGlobe size={12} />,
        text: "WEBSITE",
        color: "bg-purple-900/60 text-purple-100",
      };
    case "DOCUMENT":
      return {
        icon: <FiFileText size={12} />,
        text: "DOCUMENT",
        color: "bg-emerald-900/60 text-emerald-100",
      };
    default:
      return {
        icon: <FiBookOpen size={12} />,
        text: "ARTICLE",
        color: "bg-black/60 text-white",
      };
  }
};

const DashboardCard = ({
  badgeType,
  imageUrl,
  title,
  sourceText,
  timeAgoText,
}) => {
  const badge = getBadgeConfig(badgeType);

  return (
    <div className="bg-[#121826] rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group border border-slate-800/80 hover:border-blue-500/30 flex flex-col">
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        <div
          className={`absolute top-3 left-3 ${badge.color} backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider border border-white/10`}
        >
          {badge.icon}
          {badge.text}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <h3 className="text-white font-semibold text-[0.95rem] leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 ">
            <span className="text-xs text-slate-400 font-medium border border-slate-700/50 bg-slate-700/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              {sourceText}
            </span>
            <span className="text-xs text-slate-400 font-medium border border-slate-700/50 bg-slate-700/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              {sourceText}
            </span>
            <span className="text-xs text-slate-400 font-medium border border-slate-700/50 bg-slate-700/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              {sourceText}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {timeAgoText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
