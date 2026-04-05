import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiExternalLink,
  FiTrash,
  FiClock,
  FiTag,
} from "react-icons/fi";
import useItem from "../hook/useItem";
import { getTimeAgo } from "../utils/getTimestamps";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getBadgeConfig, getRandomTagColor } from "../utils/badgeAndColorGen";

const ItemDetails = () => {
  const { itemId } = useParams();
  const { handleFetchItem, handleDeleteItem } = useItem();
  const { loading, error, itemDetails } = useSelector((state) => state.items);

  useEffect(() => {
    handleFetchItem(itemId);
  }, [itemId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await handleDeleteItem(itemId);
        toast.success("Item deleted successfully!");
        // Redirect to all items page after deletion
        window.location.href = "/";
      } catch (err) {
        toast.error("Failed to delete item");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-6"></div>
          <div className="h-64 bg-slate-700 rounded mb-6"></div>
          <div className="h-4 bg-slate-700 rounded mb-4"></div>
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !itemDetails) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Item Not Found</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link
            to="/allitems"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to All Items
          </Link>
        </div>
      </div>
    );
  }

  const badge = getBadgeConfig(itemDetails.type);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <FiArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={itemDetails.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiExternalLink size={16} />
            Open Original
          </a>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiTrash size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#121826] rounded-2xl overflow-hidden border border-slate-800/80">
        {/* Thumbnail/Image Section */}
        <div className="relative">
          {itemDetails.type === "tweet" && itemDetails.embedHtml ? (
            <div
              className="p-6"
              dangerouslySetInnerHTML={{ __html: itemDetails.embedHtml }}
            />
          ) : itemDetails.thumbnail ? (
            <img
              src={itemDetails.thumbnail}
              alt={itemDetails.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-slate-700 flex items-center justify-center">
              <span className="text-slate-400 text-4xl">{badge.icon}</span>
            </div>
          )}

          {/* Type Badge */}
          <div
            className={`absolute top-4 left-4 ${badge.color} backdrop-blur-md px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-bold tracking-wider border border-white/10`}
          >
            <span>{badge.icon}</span>
            {badge.text}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {itemDetails.title}
          </h1>

          {/* URL */}
          <div className="mb-6">
            <a
              href={itemDetails.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 break-all text-sm"
            >
              {itemDetails.url}
            </a>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Content */}
            <div className="flex-1">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <FiClock size={14} />
                  <span>Created {getTimeAgo(itemDetails.createdAt)}</span>
                </div>

                {itemDetails.lastViewedAt && (
                  <div className="flex items-center gap-2">
                    <span>
                      Last viewed {getTimeAgo(itemDetails.lastViewedAt)}
                    </span>
                  </div>
                )}

                {itemDetails.viewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span>{itemDetails.viewCount} views</span>
                  </div>
                )}
              </div>

              {/* Content Text */}
              {itemDetails.contentText && (
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Content
                  </h3>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {itemDetails.contentText}
                  </div>
                </div>
              )}

              {/* Status */}
              {itemDetails.status && (
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        itemDetails.status === "ready"
                          ? "bg-green-500/20 text-green-300"
                          : itemDetails.status === "processing"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {itemDetails.status}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Tags */}
            {itemDetails.tags && itemDetails.tags.length > 0 && (
              <div className="lg:w-80">
                <div className="sticky top-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FiTag size={16} className="text-slate-400" />
                    <span className="text-slate-400 font-medium">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {itemDetails.tags.map((tag, index) => {
                      const tagColors = getRandomTagColor(tag);
                      return (
                        <span
                          key={index}
                          className={`text-sm font-medium backdrop-blur-sm px-3 py-2 rounded-lg border ${tagColors.bg} ${tagColors.text} ${tagColors.border} whitespace-nowrap`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
