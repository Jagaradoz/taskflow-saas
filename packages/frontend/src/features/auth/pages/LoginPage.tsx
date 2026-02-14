import { Box, Link,Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { tokens } from "@/theme";

import { LoginForm } from "../components/LoginForm";

export function LoginPage(): JSX.Element {
  return (
    <Box
      className="flex min-h-screen items-center justify-center"
      sx={{ bgcolor: tokens.bgPage }}
    >
      <Box className="flex w-full max-w-[400px] flex-col items-center gap-6 px-4">
        {/* Logo */}
        <Box className="flex items-center" sx={{ gap: "10px" }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              bgcolor: tokens.greenPrimary,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: tokens.blackOnAccent,
                lineHeight: 1,
              }}
            >
              T
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 1,
              color: tokens.white,
            }}
          >
            TASKFLOW
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: -1,
            color: tokens.white,
          }}
        >
          SIGN IN
        </Typography>

        {/* Form */}
        <LoginForm />

        {/* Register link */}
        <Box className="flex flex-wrap items-center justify-center" sx={{ gap: "4px" }}>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 500,
              color: tokens.gray500,
            }}
          >
            Don&apos;t have an account?
          </Typography>
          <Link
            component={RouterLink}
            to="/register"
            underline="none"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12,
              fontWeight: 600,
              color: tokens.greenPrimary,
            }}
          >
            Register
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
