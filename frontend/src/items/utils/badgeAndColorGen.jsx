import {
  FiBookOpen,
  FiVideo,
  FiFileText,
  FiGlobe,
  FiLinkedin,
  FiGithub,
  FiImage,
} from "react-icons/fi";
import { FiTwitter } from "react-icons/fi";
import { FaReddit } from "react-icons/fa";

export const getBadgeConfig = (type) => {
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

// Generate random color for tags
export const getRandomTagColor = (tag) => {
  // Use tag name to generate consistent colors (same tag always gets same color)
  const colors = [
    { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/30" },
    {
      bg: "bg-blue-500/20",
      text: "text-blue-300",
      border: "border-blue-500/30",
    },
    {
      bg: "bg-green-500/20",
      text: "text-green-300",
      border: "border-green-500/30",
    },
    {
      bg: "bg-yellow-500/20",
      text: "text-yellow-300",
      border: "border-yellow-500/30",
    },
    {
      bg: "bg-purple-500/20",
      text: "text-purple-300",
      border: "border-purple-500/30",
    },
    {
      bg: "bg-pink-500/20",
      text: "text-pink-300",
      border: "border-pink-500/30",
    },
    {
      bg: "bg-indigo-500/20",
      text: "text-indigo-300",
      border: "border-indigo-500/30",
    },
    {
      bg: "bg-teal-500/20",
      text: "text-teal-300",
      border: "border-teal-500/30",
    },
    {
      bg: "bg-orange-500/20",
      text: "text-orange-300",
      border: "border-orange-500/30",
    },
    {
      bg: "bg-cyan-500/20",
      text: "text-cyan-300",
      border: "border-cyan-500/30",
    },
    {
      bg: "bg-lime-500/20",
      text: "text-lime-300",
      border: "border-lime-500/30",
    },
    {
      bg: "bg-emerald-500/20",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
    },
  ];

  // Generate consistent index based on tag name
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
