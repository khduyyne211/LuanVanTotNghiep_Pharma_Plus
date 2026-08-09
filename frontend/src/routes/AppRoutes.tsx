import {
  Routes,
} from "react-router-dom";

import {
  AdminRoutes,
} from "./AdminRoutes";

import {
  CustomerRoutes,
} from "./CustomerRoutes";

function AppRoutes() {
  return (
    <Routes>
      {AdminRoutes}
      {CustomerRoutes}
    </Routes>
  );
}

export default AppRoutes;
