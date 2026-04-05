import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "./auth/pages/Login.jsx";
import Register from "./auth/pages/Register.jsx";
import Protected from "./auth/components/Protected.jsx";
import AppLayout from "./auth/components/AppLayout.jsx";
import Dashboard from "./auth/pages/Dashboard.jsx";
import AllItem from "./items/pages/AllItem.jsx";
import ItemDetails from "./items/pages/ItemDetails.jsx";
import GraphView from "./items/pages/GraphView.jsx";

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
      {
        path: "item/:itemId",
        element: <ItemDetails />,
      },
      {
        path: "graph/getgraph",
        element: <GraphView />,
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
