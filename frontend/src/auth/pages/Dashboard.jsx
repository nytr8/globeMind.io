import React, { useEffect } from "react";
import DashboardCard from "../../items/components/DashboardCard";
import { useSelector } from "react-redux";
import useItem from "../../items/hook/useItem";

const Dashboard = () => {
  // const resurfacedItems = [
  //   {
  //     badgeType: "ARTICLE",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  //     title: "The Future of Spatial Computing: A Deep Dive into AR Systems",
  //     sourceText: "Medium",
  //     timeAgoText: "1 week ago",
  //   },
  //   {
  //     badgeType: "VIDEO",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
  //     title: "Understanding Advanced Generative Models in 2026",
  //     sourceText: "YouTube",
  //     timeAgoText: "3 weeks ago",
  //   },
  //   {
  //     badgeType: "THREAD",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop",
  //     title: "Why modern SaaS architectures are shifting back to monoliths",
  //     sourceText: "X / Twitter",
  //     timeAgoText: "1 month ago",
  //   },
  // ];

  const { handleFetchRecentItems, handleResurface } = useItem();
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
                Resurfaced for you
              </h2>
            </div>
            <button className="text-blue-500 text-sm font-semibold hover:text-blue-400 transition-colors">
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resurfacedItems.map((item, index) => (
              <DashboardCard key={index} {...item} />
            ))}
          </div>
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
              <DashboardCard key={index} {...item} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
