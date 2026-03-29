import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

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

export const deleteItem = async (itemId) => {
  try {
    const response = await api.delete(`/api/delete/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};
