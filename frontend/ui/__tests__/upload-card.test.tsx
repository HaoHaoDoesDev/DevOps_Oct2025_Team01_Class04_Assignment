import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UploadZone from "@/app/user/[userId]/_components/upload-card";

describe("UploadZone", () => {
  const mockOnUpload = vi.fn();

  it("allows file selection and shows the pending file", async () => {
    const { container } = render(
      <UploadZone onUpload={mockOnUpload} userId={1} />,
    );

    const file = new File(["hello"], "test-image.png", { type: "image/png" });

    const input = container.querySelector('input[type="file"]');

    fireEvent.change(input!, { target: { files: [file] } });

    expect(screen.getByText("test-image.png")).toBeInTheDocument();
    expect(screen.getByText(/0.00 KB/i)).toBeInTheDocument();
  });

  it("does not show the upload button when no files are selected", () => {
    render(<UploadZone onUpload={mockOnUpload} userId={1} />);
    const button = screen.queryByRole("button", { name: /upload/i });
    expect(button).not.toBeInTheDocument();
  });
});
