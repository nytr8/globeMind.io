import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://globemind-io.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const registerUser = async (payload) => {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
};

const loginUser = async (payload) => {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
};

const getMe = async () => {
  const { data } = await api.get("/api/auth/get-me");
  return data;
};

const logoutUser = async () => {
  const { data } = await api.get("/api/auth/logout");
  return data;
};

const authApi = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};

export { api, registerUser, loginUser, getMe, logoutUser };
export default authApi;
