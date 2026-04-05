import { useDispatch } from "react-redux";
import { getMe, loginUser, logoutUser, registerUser } from "../services/auth.api";
import { setError, setLoading, setUser } from "../auth.slice";

const getAuthErrorDetails = (error, fallbackMessage) => {
  const responseData = error.response?.data;
  const fieldErrors = {};
  let message = responseData?.message || fallbackMessage;

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    responseData.errors.forEach((validationError) => {
      const fieldName = validationError.path || validationError.param;
      if (fieldName && !fieldErrors[fieldName]) {
        fieldErrors[fieldName] = validationError.msg;
      }
    });

    if (!responseData?.message && responseData.errors[0]?.msg) {
      message = responseData.errors[0].msg;
    }
  }

  return { message, fieldErrors };
};

const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async (payload) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await registerUser(payload);
      dispatch(setUser(data.user));
      return { success: true };
    } catch (error) {
      const errorDetails = getAuthErrorDetails(error, "Registration failed");
      dispatch(setError(errorDetails.message));
      return { success: false, ...errorDetails };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (payload) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await loginUser(payload);
      dispatch(setUser(data.user));
      return { success: true };
    } catch (error) {
      const errorDetails = getAuthErrorDetails(error, "Login failed");
      dispatch(setError(errorDetails.message));
      return { success: false, ...errorDetails };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await logoutUser();
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Logout failed"));
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
        dispatch(setUser(null));
      } else {
        dispatch(setError(error.response?.data?.message || "Failed to fetch user"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleRegister, handleLogin, handleLogout, handleGetMe };
};

export default useAuth;
