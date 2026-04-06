import React, { useEffect } from "react";
import DashboardCard from "../../items/components/DashboardCard";
import { useSelector } from "react-redux";
import useItem from "../../items/hook/useItem";

const Dashboard = () => {
  const { handleFetchRecentItems, handleResurface, handleDeleteItem } =
    useItem();
  const recentItems = useSelector((state) => state.items.recentItems);
  const resurfacedItems = useSelector((state) => state.items.resurfaceItems);

  useEffect(() => {
    handleFetchRecentItems();
    handleResurface();
  }, []);

  return (
    <>
      <div className="max-w-8xl mx-auto space-y-12 pb-12">
        {/* Resurfaced Section */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                you might have forgotten these
              </h2>
            </div>
          </div>

          {resurfacedItems.length === 0 ? (
            <div className="rounded-xl border border-slate-800/80 bg-[#121826] p-6 text-slate-300">
              you dont have enough item history
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resurfacedItems.map((item, index) => (
                <DashboardCard
                  key={index}
                  {...item}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recently Added Section */}
        <section
          className="animate-fade-in-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <div className="flex items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-slate-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Recently added
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item, index) => (
              <DashboardCard
                key={index}
                {...item}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
