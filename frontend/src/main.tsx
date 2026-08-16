import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App";
import { XacThucProvider } from "./features/xac-thuc/context/XacThucContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <XacThucProvider>
      <App />
    </XacThucProvider>
  </BrowserRouter>,
);
