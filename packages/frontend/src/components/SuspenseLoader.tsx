<<<<<<< HEAD
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Box, CircularProgress } from '@mui/material';
=======
import { Box, CircularProgress } from '@mui/material';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

const Fallback: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      bgcolor: '#0C0C0C',
    }}
  >
    <CircularProgress size={32} sx={{ color: '#00FF88' }} />
  </Box>
);
>>>>>>> 071fc1e (feat(frontend): add mock data layer and shared types)

interface SuspenseLoaderProps {
  children: ReactNode;
}

<<<<<<< HEAD
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
=======
export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ children }) => (
  <Suspense fallback={<Fallback />}>{children}</Suspense>
);
>>>>>>> 071fc1e (feat(frontend): add mock data layer and shared types)
