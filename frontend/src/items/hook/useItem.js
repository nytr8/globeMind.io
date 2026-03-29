import { useDispatch } from "react-redux";
import {
  setItems,
  setLoading,
  setError,
  setRecentItems,
  removeItem,
  addItem,
} from "../item.slice";
import { createItem, deleteItem, getAllItems } from "../services/items.api";
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
  return {
    handleCreateItem,
    handleFetchAllItems,
    handleDeleteItem,
    handleFetchRecentItems,
  };
};

export default useItem;
