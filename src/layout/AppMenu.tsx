import type { MenuModel } from "../../types";
import AppSubMenu from "./AppSubMenu";

const AppMenu = () => {
  const model: MenuModel[] = [
    {
      label: "Dashboards",
      icon: "pi pi-home",
      items: [
        {
          label: "Home",
          icon: "pi pi-fw pi-home",
          to: "/",
        },
        {
          label: "Problem one",
          icon: "pi pi-fw pi-database",
          to: "/inventory",
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
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
