import React, { useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import { useSelector } from "react-redux";
import useItem from "../hook/useItem";

const AllItem = () => {
  const items = useSelector((state) => state.items.items);
  const { handleFetchAllItems } = useItem();

  useEffect(() => {
    handleFetchAllItems();
  }, []);

  return (
    <div
      className="max-w-8xl mx-auto space-y-12 pb-12 animate-fade-in-up"
      style={{ animationDelay: "0.1s", animationFillMode: "both" }}
    >
      {items.length === 0 ? (
        <p className="text-slate-400">No items found yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <DashboardCard key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllItem;
