import { useDispatch } from "react-redux";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth.api";
import { setError, setLoading, setUser } from "../auth.slice";
import { useEffect } from "react";

const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async (payload) => {
    dispatch(setLoading(true));
    try {
      const data = await registerUser(payload);
      dispatch(setUser(data.user));
      return { success: true }; // ✅
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "registration failed"),
      );
      return { success: false }; // ✅
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (payload) => {
    dispatch(setLoading(true));
    try {
      const data = await loginUser(payload);
      dispatch(setUser(data.user));
      console.log(data.user);
      return { success: true }; // ✅
    } catch (error) {
      console.log(error);
      dispatch(setError(error.response?.data?.message || "login failed"));
      return { success: false }; // ✅
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    dispatch(setLoading(true));
    try {
      const data = await logoutUser();
    } catch (error) {
      console.log(error);
      dispatch(setError(error.response?.data?.message || "logout failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    dispatch(setLoading(true));
    try {
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(setUser(null)); // not logged in → normal case
      } else {
        dispatch(
          setError(error.response?.data?.message || "failed in fetching user"),
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };



  return { handleRegister, handleLogin, handleLogout, handleGetMe };
};

export default useAuth;
