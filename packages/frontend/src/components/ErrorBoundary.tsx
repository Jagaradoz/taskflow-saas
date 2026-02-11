import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
<<<<<<< HEAD
=======
import { AlertTriangle } from 'lucide-react';
>>>>>>> 071fc1e (feat(frontend): add mock data layer and shared types)

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
<<<<<<< HEAD
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
=======
  state: State = { hasError: false, error: null };
>>>>>>> 071fc1e (feat(frontend): add mock data layer and shared types)

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

<<<<<<< HEAD
  private handleReset = (): void => {
=======
  private handleRetry = (): void => {
>>>>>>> 071fc1e (feat(frontend): add mock data layer and shared types)
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
<<<<<<< HEAD
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box className="flex min-h-screen items-center justify-center">
          <Box className="text-center">
            <Typography variant="h5" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </Typography>
            <Button variant="contained" onClick={this.handleReset}>
              Try again
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
=======
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#0C0C0C',
          gap: 3,
          p: 4,
        }}
      >
        <AlertTriangle size={48} color="#FF4444" />
        <Typography
          variant="h2"
          sx={{ fontFamily: '"Space Grotesk", sans-serif', color: '#FFFFFF' }}
        >
          SOMETHING WENT WRONG
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#8a8a8a', maxWidth: 480, textAlign: 'center' }}
        >
          {this.state.error?.message ?? 'An unexpected error occurred.'}
        </Typography>
        <Button variant="contained" color="primary" onClick={this.handleRetry}>
          RETRY
        </Button>
      </Box>
    );
>>>>>>> 071fc1e (feat(frontend): add mock data layer and shared types)
  }
}
