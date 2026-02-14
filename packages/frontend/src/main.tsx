import "./index.css";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AppSnackbarHost } from "@/components/AppSnackbarHost";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { router } from "@/router";
import { theme } from "@/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </ErrorBoundary>
        <AppSnackbarHost />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
