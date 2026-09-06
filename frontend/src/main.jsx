import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Loader2 } from "lucide-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader2 />} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
