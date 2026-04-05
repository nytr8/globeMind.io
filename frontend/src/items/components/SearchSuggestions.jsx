import { Link, useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";

const SearchSuggestions = ({ results, isLoading, onClose }) => {
  const navigate = useNavigate();

  if (results.length === 0 && !isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[#151B2B] border border-slate-700 rounded-lg shadow-xl z-50">
        <div className="px-4 py-8 text-center text-slate-400 text-sm">
          No results found
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#151B2B] border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
      {isLoading ? (
        <div className="px-4 py-6 flex items-center justify-center">
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="divide-y divide-slate-700">
          {results.map((item) => (
            <Link
              to={item.url}
              key={item._id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 cursor-pointer transition-colors group"
              onClick={onClose}
            >
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-slate-200 font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-slate-500 text-xs truncate">
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
