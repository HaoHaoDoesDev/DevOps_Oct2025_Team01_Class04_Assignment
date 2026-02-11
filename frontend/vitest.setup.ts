import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React, { ImgHTMLAttributes } from "react";

afterEach(() => {
  cleanup();
});

// 1. MOCK NEXT.JS ROUTER
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

// 2. MOCK COOKIES
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// 3. MOCK SONNER
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement("img", {
      ...props,
      alt: props.alt || "mock-image",
    });
  },
}));

/**
 * 4. FIXED URL MOCK (The Class Approach)
 * We define a real class so 'new URL()' works perfectly.
 */
class MockURL {
  href: string;
  pathname: string;
  searchParams: URLSearchParams;

  constructor(url: string) {
    this.href = url;
    this.pathname = url;
    this.searchParams = new URLSearchParams();
  }

  toString() {
    return this.href;
  }

  // ESLint Fix: Added 'readonly' here
  static readonly createObjectURL = vi.fn(() => "blob:mock-url");
  static readonly revokeObjectURL = vi.fn();
}

// Apply the mock globally
vi.stubGlobal("URL", MockURL);

// 5. MOCK SCROLL INTO VIEW
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// 6. MOCK GLOBAL FETCH
global.fetch = vi.fn();
