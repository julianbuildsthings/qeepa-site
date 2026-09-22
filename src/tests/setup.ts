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

/*
 * Motion hands opacity and colour animations to the Web Animations API when
 * `Element.animate` exists. happy-dom implements it, but rejects each
 * animation's `finished` promise when it is cancelled — which Motion does on
 * every unmount — and nothing awaits that promise, so a test that unmounts
 * mid-fade fails the run with an unhandled rejection. Removing `animate` sends
 * Motion down its JavaScript driver, as it would in jsdom. Tests here assert on
 * structure and state, never on native animation playback.
 */
if (typeof Element !== "undefined") {
  Reflect.deleteProperty(Element.prototype, "animate");
}
