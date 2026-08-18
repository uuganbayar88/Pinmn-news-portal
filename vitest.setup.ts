import "@testing-library/jest-dom/vitest";

class IOStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = IOStub as unknown as typeof IntersectionObserver;
}
