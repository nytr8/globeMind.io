import { api } from "./items.api";

export const fetchGraph = async () => {
  try {
    const response = await api.post("/api/graph/getgraph");
    return response.data;
  } catch (error) {
    console.error("Error fetching graph:", error);
    throw error;
  }
};
