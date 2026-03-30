import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "./auth/pages/Login.jsx";
import Register from "./auth/pages/Register.jsx";
import Protected from "./auth/components/Protected.jsx";
import AppLayout from "./auth/components/AppLayout.jsx";
import Dashboard from "./auth/pages/Dashboard.jsx";
import AllItem from "./items/pages/AllItem.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "allitems",
        element: <AllItem />,
      },
    ],
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
