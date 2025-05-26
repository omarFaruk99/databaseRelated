import type { MenuModel } from "../../types";
import AppSubMenu from "./AppSubMenu";

const AppMenu = () => {
  const model: MenuModel[] = [
    {
      label: "Dashboards",
      icon: "pi pi-home",
      items: [
        {
          label: "Problem one",
          icon: "pi pi-fw pi-database",
          to: "/",
        },
        {
          label: "Problem Two",
          icon: "pi pi-fw pi-database",
          to: "/organization",
        },
        {
          label: "Problem Three",
          icon: "pi pi-fw pi-database",
          to: "/academicRecords",
        },
        {
          label: "Problem Four",
          icon: "pi pi-fw pi-database",
          to: "/stockPortfolio",
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
