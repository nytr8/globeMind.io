import { useEffect } from "react";
import { FiTrash, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../utils/getTimestamps";
import { getBadgeConfig, getRandomTagColor } from "../utils/badgeAndColorGen";

const DashboardCard = ({
  _id,
  url,
  title,
  tags,
  type,
  thumbnail,
  createdAt,
  embedHtml,
  onDelete,
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

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(_id);
            }}
            className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            title="Delete item"
          >
            <FiTrash size={14} />
          </button>
        )}

        {/* More Details Button */}
        <Link
          to={`/item/${_id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-16 bg-blue-500/80 hover:bg-blue-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          title="View details"
        >
          <FiInfo size={14} />
        </Link>

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
            {tags?.slice(0, 3).map((tag, index) => {
              const tagColors = getRandomTagColor(tag);
              return (
                <span
                  key={index}
                  className={`text-xs font-medium backdrop-blur-sm px-3 py-1 rounded-lg border ${tagColors.bg} ${tagColors.text} ${tagColors.border}`}
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
