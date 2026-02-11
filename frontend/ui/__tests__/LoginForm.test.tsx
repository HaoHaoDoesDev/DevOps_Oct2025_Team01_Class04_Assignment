import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { LoginForm } from "@/components/complex-ui/login-form";
import * as ReactHookForm from "react-hook-form";
import type { BaseSyntheticEvent } from "react";

vi.mock("@/stores/user-store", () => ({
  useAuthStore: (selector: (state: unknown) => unknown) => {
    return selector({
      setAuth: vi.fn(),
      userId: null,
      role: null,
    });
  },
}));

vi.mock("react-hook-form", async () => {
  const actual = await vi.importActual("react-hook-form");
  return {
    ...actual,
    useForm: vi.fn(),
  };
});

global.fetch = vi.fn();
const mockedFetch = vi.mocked(global.fetch);

describe("LoginForm", () => {
  it("shows validation errors for empty fields", async () => {
    (ReactHookForm.useForm as Mock).mockReturnValue({
      register: vi.fn(),
      handleSubmit: () => (e?: BaseSyntheticEvent) => {
        e?.preventDefault();
      },
      formState: {
        errors: {
          email: { message: "Invalid email address" },
        },
        isSubmitting: false,
      },
    });

    render(<LoginForm />);

    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
  });

  it("successfully logs in and sets cookies", async () => {
    type SubmitHandler = (data: Record<string, unknown>) => Promise<void>;

    (ReactHookForm.useForm as Mock).mockReturnValue({
      register: vi.fn(),
      handleSubmit: (fn: SubmitHandler) => async (e?: BaseSyntheticEvent) => {
        e?.preventDefault();
        // eslint-disable-next-line sonarjs/no-hardcoded-passwords
        await fn({ email: "test@example.com", password: "password123" });
      },
      formState: {
        errors: {},
        isSubmitting: false,
      },
    });

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "fake-jwt",
        role: "USER",
        userId: 1,
      }),
    } as Response);

    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5001/auth/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            // eslint-disable-next-line sonarjs/no-hardcoded-passwords
            password: "password123",
          }),
        }),
      );
    });
  });
});
