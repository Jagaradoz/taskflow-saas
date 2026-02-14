import { Alert,Box, Button, TextField } from "@mui/material";
import type { FormEvent } from "react";
import { useCallback,useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiError } from '@/types/api';

import { useLoginMutation } from '../hooks/use-auth';

export function LoginForm(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
        await loginMutation.mutateAsync({ email, password });
        navigate('/app', { replace: true });
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to login';
        setError(message);
      }
    },
    [email, password, navigate, loginMutation],
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
        disabled={loginMutation.isPending}
        sx={{ height: 48, fontSize: 13, letterSpacing: 1 }}
      >
        {loginMutation.isPending ? "SIGNING IN..." : "LOGIN"}
      </Button>
    </Box>
  );
}

export default LoginForm;
