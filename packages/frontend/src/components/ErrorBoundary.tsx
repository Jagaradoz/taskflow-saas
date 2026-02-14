import { Box, Button, Typography } from '@mui/material';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
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
  }
}
