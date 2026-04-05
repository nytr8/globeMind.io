import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://globemind-io.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export { api };

export const createItem = async (itemData) => {
  try {
    const response = await api.post("/api/create", itemData);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};
export const getAllItems = async (params = {}) => {
  try {
    const response = await api.get("/api/items", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const getItem = async (itemId) => {
  try {
    const response = await api.get(`/api/item/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const response = await api.delete(`/api/delete/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};
export const resurfaceItems = async () => {
  try {
    const response = await api.get(`/api/resurface`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

export const searchItems = async (query) => {
  try {
    const response = await api.get(
      `/api/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error searching items:", error);
    throw error;
  }
};
