import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React, { ImgHTMLAttributes } from "react";

afterEach(() => {
  cleanup();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

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

  static readonly createObjectURL = vi.fn(() => "blob:mock-url");
  static readonly revokeObjectURL = vi.fn();
}

vi.stubGlobal("URL", MockURL);

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  DialogTrigger: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  DialogContent: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  DialogHeader: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  DialogTitle: ({ children }: { children: React.ReactNode }) =>
    React.createElement("h1", null, children),
  DialogDescription: ({ children }: { children: React.ReactNode }) =>
    React.createElement("p", null, children),
  DialogFooter: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
  }) => React.createElement("div", { onClick, role: "button" }, children),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  DropdownMenuSeparator: () => React.createElement("hr"),
}));

interface SelectProps {
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, defaultValue }: SelectProps) =>
    React.createElement(
      "div",
      {
        "data-testid": "mock-select",
        onClick: () => onValueChange?.(defaultValue || "USER"),
      },
      children,
    ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) =>
    React.createElement("button", null, children),
  SelectValue: () => React.createElement("span", null, "Select Value"),
  SelectContent: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  SelectItem: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
}));

interface FormRenderProps {
  field: {
    value: string;
    onChange: () => void;
    onBlur: () => void;
  };
}

vi.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) =>
    React.createElement("form", null, children),
  FormControl: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  FormField: ({
    render,
  }: {
    render: (args: FormRenderProps) => React.ReactNode;
  }) => render({ field: { value: "", onChange: vi.fn(), onBlur: vi.fn() } }),
  FormItem: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", null, children),
  FormLabel: ({ children }: { children: React.ReactNode }) =>
    React.createElement("label", null, children),
  FormMessage: () => null,
}));

if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

global.fetch = vi.fn();
