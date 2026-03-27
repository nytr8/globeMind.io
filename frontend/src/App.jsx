import { RouterProvider } from "react-router-dom";
import appRouter from "./app.routes.jsx";
import useAuth from "./auth/hook/useAuth.js";
import { useEffect } from "react";

const App = () => {
  const { handleGetMe } = useAuth();
  useEffect(() => {
    handleGetMe();
  }, []);
  return <RouterProvider router={appRouter} />;
};

export default App;
