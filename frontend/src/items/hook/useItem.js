import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setItems,
  setLoading,
  setError,
  setRecentItems,
  removeItem,
  addItem,
  setResurfaceItems,
  setReslts,
} from "../item.slice";
import {
  createItem,
  deleteItem,
  getAllItems,
  resurfaceItems,
  searchItems,
} from "../services/items.api";
const useItem = () => {
  const dispatch = useDispatch();

  const handleCreateItem = async (url) => {
    dispatch(setLoading(true));
    try {
      const data = await createItem(url);

      dispatch(addItem(data.item));

      console.log("Item created:", data);
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Something went wrong creating item",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFetchAllItems = async () => {
    dispatch(setLoading(true));
    try {
      const data = await getAllItems();

      dispatch(setItems(data.items));

      console.log("All items fetched:", data.items);
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Something went wrong fetching items",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFetchRecentItems = async () => {
    dispatch(setLoading(true));
    try {
      const data = await getAllItems({
        sort: "createdAt:desc",
        limit: 3,
      });

      dispatch(setRecentItems(data.items));

      console.log("Recent items:", data.items);
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message ||
            "Something went wrong fetching items",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteItem = async (itemId) => {
    dispatch(setLoading(true));
    try {
      const data = await deleteItem(itemId);
      dispatch(removeItem(itemId));
      console.log("Item deleted:", data.item);
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Something went wrong deleting item",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleResurface = async () => {
    dispatch(setLoading(true));
    try {
      const data = await resurfaceItems();
      dispatch(setResurfaceItems(data));
      console.log("Item deleted:", data.item);
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Something went wrong deleting item",
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleSearch = useCallback(
    async (query) => {
      dispatch(setLoading(true));
      try {
        const results = await searchItems(query);
        dispatch(setReslts(results.results || results));
        console.log("Search results:", results);
      } catch (error) {
        dispatch(
          setError(
            error.response?.data?.message ||
              "Something went wrong searching items",
          ),
        );
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );
  return {
    handleCreateItem,
    handleFetchAllItems,
    handleDeleteItem,
    handleFetchRecentItems,
    handleResurface,
    handleSearch,
  };
};

export default useItem;
