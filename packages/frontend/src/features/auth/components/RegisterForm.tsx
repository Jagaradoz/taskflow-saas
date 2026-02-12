import { useState, useCallback } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Alert } from "@mui/material";
import { mockRegister } from '../../../mock/auth';

export function RegisterForm(): JSX.Element {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      setLoading(true);

      // Simulate async delay
      setTimeout(() => {
        const result = mockRegister(name, email, password);
        const firstOrg = result?.memberships[0];
        navigate(firstOrg ? `/app/${firstOrg.orgId}` : "/no-org", { replace: true });
      }, 300);
    },
    [name, email, password, navigate],
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
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        autoComplete="name"
        autoFocus
        InputProps={{ sx: { height: 48 } }}
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
        InputProps={{ sx: { height: 48 } }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        autoComplete="new-password"
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
        {loading ? "CREATING ACCOUNT..." : "REGISTER"}
      </Button>
    </Box>
  );
}

export default RegisterForm;
