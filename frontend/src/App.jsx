import { RouterProvider } from "react-router-dom";
import appRouter from "./app.routes.jsx";
import useAuth from "./auth/hook/useAuth.js";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
const App = () => {
  const { handleGetMe } = useAuth();
  useEffect(() => {
    handleGetMe();
  }, []);
  return (
    <>
      <Toaster />
      <RouterProvider router={appRouter} />;
    </>
  );
};

export default App;
