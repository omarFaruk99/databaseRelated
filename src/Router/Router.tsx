import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import NotFound from "../NotFound/NotFound";
import Home from "../Pages/Home";
import InventoryTable from "../Pages/Inventory/InventoryTable";

export const router: any = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/inventory",
        element: <InventoryTable />,
      },
    ],
  },
]);
