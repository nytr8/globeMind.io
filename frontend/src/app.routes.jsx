import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "./auth/pages/Login.jsx";
import Register from "./auth/pages/Register.jsx";
import Protected from "./auth/components/Protected.jsx";
import Dashboard from "./auth/pages/Dashboard.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default appRouter;
