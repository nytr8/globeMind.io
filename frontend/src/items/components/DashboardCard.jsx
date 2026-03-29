import React, { useEffect } from "react";
import {
  FiBookOpen,
  FiVideo,
  FiFileText,
  FiGlobe,
  FiLinkedin,
  FiGithub,
  FiImage,
  FiActivity,
} from "react-icons/fi";
import { FiTwitter } from "react-icons/fi";
import { FaReddit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../utils/getTimestamps";

const getBadgeConfig = (type) => {
  switch (type?.toUpperCase()) {
    case "IMAGE":
      return {
        icon: <FiImage size={12} />,
        text: "IMAGE",
        color: "bg-black/60 text-white",
      };
    case "VIDEO":
      return {
        icon: <FiVideo size={12} />,
        text: "VIDEO",
        color: "bg-blue-900/60 text-blue-100",
      };
    case "REDDIT":
      return {
        icon: <FaReddit size={12} />,
        text: "REDDIT",
        color: "bg-blue-900/60 text-blue-100",
      };
    case "GITHUB":
      return {
        icon: <FiGithub size={12} />,
        text: "GITHUB",
        color: "bg-blue-900/60 text-blue-100",
      };
    case "TWEET":
      return {
        icon: <FiTwitter size={12} />,
        text: "TWEET",
        color: "bg-slate-800/60 text-slate-100",
      };
    case "LINKEDIN":
      return {
        icon: <FiLinkedin size={12} />,
        text: "LINKEDIN",
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
  url,
  title,
  tags,
  type,
  thumbnail,
  createdAt,
  embedHtml,
}) => {
  const badge = getBadgeConfig(type);

  // ✅ Twitter embed render fix
  useEffect(() => {
    if (type === "tweet" && window.twttr) {
      window.twttr.widgets.load();
    }
  }, [embedHtml, type]);

  return (
    <Link
      to={url}
      className="bg-[#121826] rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group border border-slate-800/80 hover:border-blue-500/30 flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden">
        {/* ✅ Only change here */}
        {type === "tweet" && embedHtml ? (
          <div
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

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
            {tags?.map((tag, index) => {
              return (
                <span
                  key={index}
                  className="text-xs text-slate-400 font-medium border border-slate-700/50 bg-slate-700/20 backdrop-blur-sm px-3 py-1 rounded-lg"
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {getTimeAgo(createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCard;
