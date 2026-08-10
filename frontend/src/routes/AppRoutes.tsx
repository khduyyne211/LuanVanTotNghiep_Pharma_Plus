import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminRoutes from "./AdminRoutes";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/admin/dashboard"
            replace
          />
        }
      />

      <Route
        path="/admin/*"
        element={<AdminRoutes />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/admin/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;