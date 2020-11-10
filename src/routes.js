/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Live from "views/Live.js";
import Menu from "./containers/Menu.js";

var routes = [
  {
    path: "/live",
    name: "Live Commands",
    icon: "tim-icons icon-puzzle-10",
    component: Live,
    layout: "/admin"
  },
  {
    path: "/menu",
    name: "Menu",
    icon: "tim-icons icon-align-center",
    component: Menu,
    layout: "/admin"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "tim-icons icon-settings-gear-63",
    component: Live,
    layout: "/admin"
  },
];
export default routes;
