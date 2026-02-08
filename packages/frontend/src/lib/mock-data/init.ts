/**
 * Mock data initialization
 */

import { STORAGE_KEYS } from "./types";
import { MOCK_TASKS, MOCK_REQUESTS } from "./fixtures";

export function initializeMockData(): void {
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(MOCK_TASKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(MOCK_REQUESTS));
  }
}

export function resetMockData(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.REQUESTS);
  initializeMockData();
}

// Initialize on module load
initializeMockData();
