import { useMemo } from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { getErrorMessage } from '@/lib/notifications';

export function RouteErrorBoundary(): JSX.Element {
  const navigate = useNavigate();
  const error = useRouteError();

  const message = useMemo(() => {
    if (isRouteErrorResponse(error)) {
      return error.statusText || `Request failed (${error.status})`;
    }
    return getErrorMessage(error);
  }, [error]);

  return (
    <Box className="flex min-h-[50vh] items-center justify-center p-6">
      <Box className="max-w-lg text-center">
        <Typography variant="h5" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {message}
        </Typography>
        <Button variant="contained" onClick={() => navigate(0)}>
          Try again
        </Button>
      </Box>
    </Box>
  );
}
