import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <GoogleOAuthProvider clientId="1072659104586-vt93b43bbkcefh64tg5uenpj8ucv8mp2.apps.googleusercontent.com"> */}
      <App />
    {/* </GoogleOAuthProvider> */}
  </StrictMode>
);
