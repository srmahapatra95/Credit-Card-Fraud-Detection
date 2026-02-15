import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/context/AuthContext";
import { PredictionProvider } from "@/context/PredictionContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <PredictionProvider>
        <App />
      </PredictionProvider>
    </AuthProvider>
  </StrictMode>
);
