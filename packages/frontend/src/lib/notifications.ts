import { ApiError } from '@/types/api';

type ErrorNotifier = (message: string) => void;

let notifier: ErrorNotifier | null = null;

export function registerErrorNotifier(next: ErrorNotifier): () => void {
  notifier = next;
  return () => {
    if (notifier === next) {
      notifier = null;
    }
  };
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function notifyError(error: unknown, fallback?: string): void {
  notifier?.(getErrorMessage(error, fallback));
}
