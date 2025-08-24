/**
 * Test setup file for Vitest and React Testing Library
 * 
 * This file configures the testing environment, including:
 * - Setting up the Mock Service Worker (MSW) server
 * - Extending Vitest's expect with React Testing Library matchers
 * - Setting up cleanup hooks to run before and after tests
 */

// These imports will work once dependencies are installed
// @ts-ignore
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
// @ts-ignore
import { cleanup } from '@testing-library/react';
// @ts-ignore
import * as matchers from '@testing-library/jest-dom/matchers';
// @ts-ignore
import { setupServer } from 'msw/node';
// Import the API handlers
import { handlers } from './handlers';

// Extend Vitest's expect method with testing-library methods
expect.extend(matchers);

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Create MSW server with our API handlers
export const server = setupServer(...handlers);

// Listen for API requests before all tests
// @ts-ignore
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset request handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
// @ts-ignore
afterAll(() => server.close());
