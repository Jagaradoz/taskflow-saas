import { useState, useCallback } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Alert } from "@mui/material";
import { mockLogin } from '../../../mock/auth';

export function LoginForm(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      // Simulate async delay
      setTimeout(() => {
        const result = mockLogin(email, password);

        if (!result) {
          setError("Invalid email or password. Try john@example.com");
          setLoading(false);
          return;
        }

        navigate("/", { replace: true });
      }, 300);
    },
    [email, password, navigate],
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="flex w-full flex-col"
      sx={{ gap: "16px" }}
    >
      {error && (
        <Alert severity="error" variant="outlined">
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
        autoFocus
        InputProps={{ sx: { height: 48 } }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        autoComplete="current-password"
        InputProps={{ sx: { height: 48 } }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ height: 48, fontSize: 13, letterSpacing: 1 }}
      >
        {loading ? "SIGNING IN..." : "LOGIN"}
      </Button>
    </Box>
  );
}

export default LoginForm;
