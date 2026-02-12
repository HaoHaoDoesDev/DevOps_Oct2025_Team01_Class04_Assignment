import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { AddUserDialog } from "@/app/admin/[userId]/_components/create-user-dialog";
import * as ReactHookForm from "react-hook-form";
import type { BaseSyntheticEvent } from "react";

vi.mock("js-cookie", () => ({
  default: { get: () => "fake-admin-token" },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
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

describe("AddUserDialog", () => {
  const mockOnUserAdded = vi.fn();

  it("submits the form with correct data", async () => {
    type SubmitHandler = (data: Record<string, unknown>) => Promise<void>;

    (ReactHookForm.useForm as Mock).mockReturnValue({
      control: {},
      handleSubmit: (fn: SubmitHandler) => async (e?: BaseSyntheticEvent) => {
        e?.preventDefault();
        await fn({
          email: "newuser@test.com",
          // eslint-disable-next-line sonarjs/no-hardcoded-passwords
          password: "password123",
          role: "USER",
        });
      },
      formState: { isSubmitting: false, errors: {} },
      reset: vi.fn(),
    });

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<AddUserDialog onUserAdded={mockOnUserAdded} />);

    fireEvent.click(screen.getByText("Add User"));

    const submitBtn = screen.getByRole("button", { name: /save user/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/admin/users",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("newuser@test.com"),
        }),
      );
      expect(mockOnUserAdded).toHaveBeenCalled();
    });
  });
});
