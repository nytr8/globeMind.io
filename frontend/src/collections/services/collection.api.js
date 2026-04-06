import { api } from "../../items/services/items.api";

export const createCollection = async (payload) => {
  const response = await api.post("/api/collections", payload);
  return response.data;
};

export const getCollections = async () => {
  const response = await api.get("/api/collections");
  return response.data;
};

export const getCollectionById = async (collectionId) => {
  const response = await api.get(`/api/collections/${collectionId}`);
  return response.data;
};

export const updateCollection = async (collectionId, payload) => {
  const response = await api.patch(`/api/collections/${collectionId}`, payload);
  return response.data;
};

export const deleteCollection = async (collectionId) => {
  const response = await api.delete(`/api/collections/${collectionId}`);
  return response.data;
};

export const addItemToCollection = async (collectionId, itemId) => {
  const response = await api.post(`/api/collections/${collectionId}/items/${itemId}`);
  return response.data;
};

export const removeItemFromCollection = async (collectionId, itemId) => {
  const response = await api.delete(
    `/api/collections/${collectionId}/items/${itemId}`,
  );
  return response.data;
};
