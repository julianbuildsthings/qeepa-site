import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/**
 * Testing Library only auto-registers cleanup when Vitest globals are enabled,
 * and they are not. Without this, renders accumulate across tests in a file and
 * queries start matching elements from earlier cases.
 *
 * Guarded because this setup file also loads for the node-environment tests,
 * which have no document to clean up.
 */
afterEach(() => {
  if (typeof document !== "undefined") {
    cleanup();
  }
});
