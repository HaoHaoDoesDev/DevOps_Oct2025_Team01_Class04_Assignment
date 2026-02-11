import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdminDashboard from "@/app/admin/[userId]/page";

vi.mock("@/components/ui/admin-table", () => ({
  DataTable: ({ data }: { data: unknown[] }) => (
    <div data-testid="mock-table">Users found: {data.length}</div>
  ),
}));

vi.mock("@/app/admin/[userId]/_components/create-user-dialog", () => ({
  AddUserDialog: () => <button>Mock Add User</button>,
}));

vi.mock("js-cookie", () => ({
  default: { get: () => "fake-admin-token" },
}));

global.fetch = vi.fn();
const mockedFetch = vi.mocked(global.fetch);

describe("AdminDashboard", () => {
  it("fetches users on mount and renders the table", async () => {
    const mockUsers = [
      { id: 1, email: "user1@example.com", role: "USER" },
      { id: 2, email: "admin@example.com", role: "ADMIN" },
    ];

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    render(<AdminDashboard />);

    expect(screen.getByText(/loading users.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("mock-table")).toHaveTextContent(
        "Users found: 2",
      );
    });
  });

  it("handles fetch errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedFetch.mockRejectedValueOnce(new Error("Network Error"));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/loading users.../i)).not.toBeInTheDocument();
      expect(screen.getByTestId("mock-table")).toHaveTextContent(
        "Users found: 0",
      );
    });

    consoleSpy.mockRestore();
  });
});
