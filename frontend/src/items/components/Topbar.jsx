import { useState } from "react";
import { FiSearch, FiPlus, FiLogOut } from "react-icons/fi";
import useItem from "../hook/useItem";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import useAuth from "../../auth/hook/useAuth";
import { setUser } from "../../auth/auth.slice";
import { useNavigate } from "react-router-dom";
const Topbar = () => {
  const [inputValue, setInputValue] = useState("");
  const loading = useSelector((state) => state.items.loading);
  const { handleCreateItem } = useItem();
  const { handleLogout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    await toast.promise(handleCreateItem({ url: trimmedValue }), {
      loading: "Saving item...",
      success: "Item saved successfully!",
      error: "Failed to save item.",
    });
    setInputValue("");
  };
  return (
    <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#0D111A]">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch
              className="text-slate-500 group-focus-within:text-blue-500 transition-colors"
              size={16}
            />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste URL, text, or drop file to save..."
            className="w-full bg-[#151B2B] text-slate-300 text-sm rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-[#1A2235] transition-all border border-transparent focus:border-slate-700"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-slate-500 font-medium bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50">
              ⌘K
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-500 hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <>
              <FiPlus size={16} /> Save
            </>
          )}
        </button>
      </div>

      <button
        onClick={() => {
          handleLogout();
          dispatch(setUser(null));
          navigate("/login");
        }}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors ml-4 group"
      >
        <FiLogOut
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform"
        />{" "}
        Logout
      </button>
    </header>
  );
};

export default Topbar;
