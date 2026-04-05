import { useState, useEffect, useRef } from "react";
import { FiSearch, FiPlus, FiLogOut, FiX } from "react-icons/fi";
import useItem from "../hook/useItem";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import useAuth from "../../auth/hook/useAuth";
import { setUser } from "../../auth/auth.slice";
import { useNavigate } from "react-router-dom";
import SearchSuggestions from "./SearchSuggestions";
const Topbar = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef(null);
  const loading = useSelector((state) => state.items.loading);
  const results = useSelector((state) => state.items.results);
  const { handleCreateItem, handleSearch } = useItem();
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

  // Debounced search handler
  useEffect(() => {
    if (!searchValue.trim()) {
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      await handleSearch(searchValue.trim());
    }, 500); // 500ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchValue, handleSearch]);

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
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
      <div className="mr-20">
        <div className="relative group w-60">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch
              className="text-slate-500 group-focus-within:text-blue-500 transition-colors"
              size={16}
            />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => searchValue && setShowSuggestions(true)}
            placeholder="Search items..."
            className="w-full bg-[#151B2B] text-slate-300 text-sm rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-[#1A2235] transition-all border border-transparent focus:border-slate-700"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                setShowSuggestions(false);
                setSearchResults([]);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
            >
              <FiX size={14} />
            </button>
          )}
          {showSuggestions && searchValue && (
            <SearchSuggestions
              results={results}
              isLoading={loading}
              onClose={handleCloseSuggestions}
            />
          )}
        </div>
      </div>
      <button
        onClick={() => {
          handleLogout();
          dispatch(setUser(null));
          navigate("/login");
        }}
        className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 text-sm font-medium transition-all ml-4 group px-3 py-2 rounded-lg border border-red-500/20 hover:border-red-500/30"
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
