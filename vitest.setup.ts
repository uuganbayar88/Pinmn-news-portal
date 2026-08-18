import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

class IOStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = IOStub as unknown as typeof IntersectionObserver;
}
