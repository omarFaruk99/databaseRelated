import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import NotFound from "../NotFound/NotFound";
import AcademicRecordsTable from "../Pages/Academic Records/AcademicRecordsTable";
import Home from "../Pages/Home";
import InventoryTable from "../Pages/Inventory/InventoryTable";
import OrganizationStructure from "../Pages/Organization/OrganizationStructure";

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
      {
        path: "/organization",
        element: <OrganizationStructure />,
      },
      {
        path: "/academicRecords",
        element: <AcademicRecordsTable />,
      },
    ],
  },
]);
