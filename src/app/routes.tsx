import { createBrowserRouter } from "react-router";
import { Home } from "@/app/pages/home";
import { EventDetail } from "@/app/pages/event-detail";
import { Impressum } from "@/app/pages/impressum";
import { Datenschutz } from "@/app/pages/datenschutz";
import { Partner } from "@/app/pages/partner";
import { Admin } from "@/app/pages/admin";
import { Brands } from "@/app/pages/brands";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/event/:id",
    element: <EventDetail />,
  },
  {
    path: "/impressum",
    element: <Impressum />,
  },
  {
    path: "/datenschutz",
    element: <Datenschutz />,
  },
  {
    path: "/partner",
    element: <Partner />,
  },
  {
    path: "/brands",
    element: <Brands />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);