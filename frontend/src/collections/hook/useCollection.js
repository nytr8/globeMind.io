import { useDispatch } from "react-redux";
import {
  removeCollection,
  setCollectionError,
  setCollectionItems,
  setCollectionLoading,
  setCollections,
  setSelectedCollection,
  upsertCollection,
} from "../collection.slice";
import {
  addItemToCollection,
  createCollection,
  deleteCollection,
  getCollectionById,
  getCollections,
  removeItemFromCollection,
  updateCollection,
} from "../services/collection.api";

const useCollection = () => {
  const dispatch = useDispatch();

  const handleFetchCollections = async () => {
    dispatch(setCollectionLoading(true));
    try {
      const data = await getCollections();
      dispatch(setCollections(data.collections || []));
      return data.collections || [];
    } catch (error) {
      dispatch(
        setCollectionError(
          error.response?.data?.message ||
            "Something went wrong fetching collections",
        ),
      );
      return [];
    } finally {
      dispatch(setCollectionLoading(false));
    }
  };

  const handleFetchCollectionById = async (collectionId) => {
    dispatch(setCollectionLoading(true));
    try {
      const data = await getCollectionById(collectionId);
      dispatch(setSelectedCollection(data.collection || null));
      dispatch(setCollectionItems(data.items || []));
      return data;
    } catch (error) {
      dispatch(
        setCollectionError(
          error.response?.data?.message ||
            "Something went wrong fetching collection details",
        ),
      );
      dispatch(setSelectedCollection(null));
      dispatch(setCollectionItems([]));
      return null;
    } finally {
      dispatch(setCollectionLoading(false));
    }
  };

  const handleCreateCollection = async (payload) => {
    dispatch(setCollectionLoading(true));
    try {
      const data = await createCollection(payload);
      dispatch(upsertCollection({ ...data.collection, itemCount: 0 }));
      return data.collection;
    } catch (error) {
      dispatch(
        setCollectionError(
          error.response?.data?.message ||
            "Something went wrong creating collection",
        ),
      );
      throw error;
    } finally {
      dispatch(setCollectionLoading(false));
    }
  };

  const handleUpdateCollection = async (collectionId, payload) => {
    dispatch(setCollectionLoading(true));
    try {
      const data = await updateCollection(collectionId, payload);
      dispatch(upsertCollection(data.collection));
      dispatch(setSelectedCollection(data.collection));
      return data.collection;
    } catch (error) {
      dispatch(
        setCollectionError(
          error.response?.data?.message ||
            "Something went wrong updating collection",
        ),
      );
      throw error;
    } finally {
      dispatch(setCollectionLoading(false));
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    dispatch(setCollectionLoading(true));
    try {
      await deleteCollection(collectionId);
      dispatch(removeCollection(collectionId));
      return true;
    } catch (error) {
      dispatch(
        setCollectionError(
          error.response?.data?.message ||
            "Something went wrong deleting collection",
        ),
      );
      throw error;
    } finally {
      dispatch(setCollectionLoading(false));
    }
  };

  const handleAddItemToCollection = async (collectionId, itemId) => {
    dispatch(setCollectionLoading(true));
    try {
      const data = await addItemToCollection(collectionId, itemId);
      return data.item;
    } catch (error) {
      dispatch(
        setCollectionError(
          error.response?.data?.message ||
            "Something went wrong adding item to collection",
        ),
      );
      throw error;
    } finally {
      dispatch(setCollectionLoading(false));
    }
  };

  const handleRemoveItemFromCollection = async (collectionId, itemId) => {
    dispatch(setCollectionLoading(true));
    try {
      const data = await removeItemFromCollection(collectionId, itemId);
      return data.item;
    } catch (error) {
      dispatch(
        setCollectionError(
          error.response?.data?.message ||
            "Something went wrong removing item from collection",
        ),
      );
      throw error;
    } finally {
      dispatch(setCollectionLoading(false));
    }
  };

  return {
    handleFetchCollections,
    handleFetchCollectionById,
    handleCreateCollection,
    handleUpdateCollection,
    handleDeleteCollection,
    handleAddItemToCollection,
    handleRemoveItemFromCollection,
  };
};

export default useCollection;
