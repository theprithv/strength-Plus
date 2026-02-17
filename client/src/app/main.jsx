import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../styles/index.css";
import App from "./App.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ExerciseProvider } from "../context/ExerciseContext.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ExerciseProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </ExerciseProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
