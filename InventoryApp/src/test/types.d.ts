// Custom type definitions for tests
import '@testing-library/jest-dom';

declare module 'vitest' {
  export interface TestContext {
    // Additional context for tests
    queryClient: import('@tanstack/react-query').QueryClient;
  }
}

// Extend window with localStorage for tests
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface Window {
  localStorage: Storage;
  sessionStorage: Storage;
}

// MSW type definitions
declare module 'msw' {
  export const http: any;
  export class HttpResponse {
    static json(body: any, init?: ResponseInit): Response;
  }
}

// Make sure TypeScript knows about the test types
declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toHaveTextContent(text: string | RegExp): void;
      toHaveAttribute(name: string, value?: string): void;
      toBeVisible(): void;
      toBeDisabled(): void;
      toBeEnabled(): void;
      toHaveClass(className: string): void;
      toHaveFocus(): void;
      toBeChecked(): void;
      toBeEmpty(): void;
      toHaveValue(value: string | string[] | number): void;
      toHaveStyle(css: Record<string, string>): void;
    }
  }
}
