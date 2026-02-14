import { useCallback, useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { registerErrorNotifier } from '@/lib/notifications';

export function AppSnackbarHost(): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => registerErrorNotifier((nextMessage) => setMessage(nextMessage)), []);

  const handleClose = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={4500}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
