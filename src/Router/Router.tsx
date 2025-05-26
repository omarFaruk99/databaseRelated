import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import NotFound from "../NotFound/NotFound";
import AcademicRecordsTable from "../Pages/Academic Records/AcademicRecordsTable";
import FactoryPage from "../Pages/Factory/FactoryPage";
import InventoryTable from "../Pages/Inventory/InventoryTable";
import OrganizationStructure from "../Pages/Organization/OrganizationStructure";
import PortfolioPage from "../Pages/Portfolio/PortfolioPage";
import FifthProblemDataTable from "../Pages/Warehouse/FifthProblemDataTable";

export const router: any = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true, // This makes it the default route
        element: <InventoryTable />,
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
      {
        path: "/stockPortfolio",
        element: <PortfolioPage />,
      },
      {
        path: "/warehouse",
        element: <FifthProblemDataTable />,
      },
      {
        path: "/factory",
        element: <FactoryPage />,
      },
    ],
  },
]);
