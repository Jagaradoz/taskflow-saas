import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SuspenseLoaderProps {
  children: ReactNode;
}

function Fallback(): JSX.Element {
  return (
    <Box className="flex min-h-[200px] items-center justify-center">
      <CircularProgress size={32} />
    </Box>
  );
}

export function SuspenseLoader({ children }: SuspenseLoaderProps): JSX.Element {
  return <Suspense fallback={<Fallback />}>{children}</Suspense>;
}
