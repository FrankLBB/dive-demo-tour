import { createBrowserRouter } from "react-router";
import { Home } from "@/app/pages/home";
import { EventDetail } from "@/app/pages/event-detail";
import { Impressum } from "@/app/pages/impressum";
import { Partner } from "@/app/pages/partner";
import { Admin } from "@/app/pages/admin";
import { About } from "@/app/pages/about";

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
    path: "/about",
    element: <About />,
  },
  {
    path: "/impressum",
    element: <Impressum />,
  },
  {
    path: "/partner",
    element: <Partner />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);