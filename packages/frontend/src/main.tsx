import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { queryClient } from "@/lib/query-client";
import { theme } from "@/theme";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./index.css";

function App(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900">TaskFlow</h1>
        <p className="text-slate-600">Multi-tenant SaaS platform</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
