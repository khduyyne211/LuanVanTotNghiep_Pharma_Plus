import {
  Routes,
} from "react-router-dom";

import {
  AdminRoutes,
} from "./AdminRoutes";

import {
  CustomerRoutes,
} from "./CustomerRoutes";

import {
  DuocSiRoutes,
} from "./DuocSiRoutes";

function AppRoutes() {
  return (
    <Routes>
      {AdminRoutes}
      {DuocSiRoutes}
      {CustomerRoutes}
    </Routes>
  );
}

export default AppRoutes;