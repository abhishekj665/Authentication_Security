import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LoadingProvider } from "./loadingContext.jsx";
import { GlobalLoader } from "./GlobalLoader.jsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./components/theme.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <LoadingProvider>
          <App />
          <GlobalLoader />
        </LoadingProvider>
      </LocalizationProvider>
    </Provider>
  </ThemeProvider>,
);
