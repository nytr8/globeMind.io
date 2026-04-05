import React, { useEffect, useState, useMemo } from "react";
import DashboardCard from "../components/DashboardCard";
import { useSelector } from "react-redux";
import useItem from "../hook/useItem";
import { FiChevronDown, FiFilter, FiRefreshCw } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const AllItem = () => {
  const items = useSelector((state) => state.items.items);
  const { handleFetchAllItems, handleDeleteItem } = useItem();
  const [sortBy, setSortBy] = useState("date-desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Small delay to ensure any pending item creation has completed
    const timer = setTimeout(() => {
      handleFetchAllItems();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Refresh when navigating to this page

  // Refresh items when window gains focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      handleFetchAllItems();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await handleFetchAllItems();
    setIsRefreshing(false);
  };

  const sortOptions = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "type", label: "By Type" },
  ];

  const typeOrder = [
    "VIDEO",
    "IMAGE",
    "DOCUMENT",
    "GITHUB",
    "REDDIT",
    "TWEET",
    "LINKEDIN",
    "WEBSITE",
    "ARTICLE",
  ];

  const sortedItems = useMemo(() => {
    const sorted = [...items];

    switch (sortBy) {
      case "date-desc":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      case "date-asc":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      case "type":
        return sorted.sort((a, b) => {
          const aIndex = typeOrder.indexOf(a.type?.toUpperCase());
          const bIndex = typeOrder.indexOf(b.type?.toUpperCase());

          // First sort by type order
          if (aIndex !== bIndex) {
            return aIndex - bIndex;
          }

          // Within the same type, sort by date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      default:
        return sorted;
    }
  }, [items, sortBy]);

  // Group items by type for display when sorting by type
  const groupedItems = useMemo(() => {
    if (sortBy !== "type") return null;

    const groups = {};
    sortedItems.forEach((item) => {
      const type = item.type?.toUpperCase() || "ARTICLE";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(item);
    });
    return groups;
  }, [sortedItems, sortBy]);

  return (
    <div className="max-w-8xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      {/* Sort Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">All Items</h1>
          <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
            {items.length} items
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors border border-slate-600/50 disabled:opacity-60"
            title="Refresh items"
          >
            <FiRefreshCw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors border border-slate-600/50"
            >
              <FiFilter size={16} />
              Sort:{" "}
              {sortOptions.find((option) => option.value === sortBy)?.label}
              <FiChevronDown
                size={14}
                className={`transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-700/50 transition-colors ${
                      sortBy === option.value
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <p className="text-slate-400">No items found yet.</p>
      ) : sortBy === "type" && groupedItems ? (
        // Grouped view for type sorting
        <div className="space-y-12">
          {typeOrder.map((type) => {
            const typeItems = groupedItems[type];
            if (!typeItems || typeItems.length === 0) return null;

            return (
              <div key={type} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white capitalize">
                    {type.toLowerCase()}s
                  </h2>
                  <span className="text-sm text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
                    {typeItems.length}
                  </span>
                  <div className="flex-1 h-px bg-slate-700/50"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typeItems.map((item, index) => (
                    <DashboardCard key={`${type}-${index}`} {...item} onDelete={handleDeleteItem} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Regular grid view for date sorting
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item, index) => (
            <DashboardCard key={index} {...item} onDelete={handleDeleteItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllItem;
