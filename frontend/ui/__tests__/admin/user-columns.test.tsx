import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { getUserColumns } from "@/app/admin/[userId]/_components/user-management-table-columns"; // Check path
import { Row, CellContext } from "@tanstack/react-table";
import { User } from "@/types/user";
import React from "react";

vi.mock("js-cookie", () => ({
  default: { get: () => "fake-admin-token" },
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

global.fetch = vi.fn();
const mockedFetch = vi.mocked(global.fetch);
global.confirm = vi.fn(() => true);

describe("UserColumns - Actions Cell", () => {
  const mockOnDeleted = vi.fn();
  const mockUser: User = { id: 123, email: "delete-me@test.com", role: "USER" };

  it("deletes user when confirmed", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    const columns = getUserColumns(mockOnDeleted);
    const actionsColumn = columns.find((col) => col.id === "actions");

    if (!actionsColumn || !actionsColumn.cell) {
      throw new Error("Actions column not found");
    }

    const fakeRow = { original: mockUser } as unknown as Row<User>;
    const fakeContext = { row: fakeRow } as unknown as CellContext<
      User,
      unknown
    >;

    const CellComponent = actionsColumn.cell as React.ComponentType<
      CellContext<User, unknown>
    >;

    render(<CellComponent {...fakeContext} />);

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText("Delete User");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:5001/users/123",
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(mockOnDeleted).toHaveBeenCalled();
    });
  });
});
