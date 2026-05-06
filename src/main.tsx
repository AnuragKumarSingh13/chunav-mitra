import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CandidateProvider } from "./context/CandidateContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CandidateProvider>
        <App />
      </CandidateProvider>
    </BrowserRouter>
  </StrictMode>
);
