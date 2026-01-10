import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import EnvConfig from "./config/env.ts";
import {store} from "./store";
import {Provider} from "react-redux";

console.log("GOOGLE_CLIENT_ID =", EnvConfig.GOOGLE_CLIENT_ID);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
        <GoogleOAuthProvider clientId={EnvConfig.GOOGLE_CLIENT_ID}>
            <Provider store={store}>
                <AppWrapper>
                   <App />
                </AppWrapper>
            </Provider>
        </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
