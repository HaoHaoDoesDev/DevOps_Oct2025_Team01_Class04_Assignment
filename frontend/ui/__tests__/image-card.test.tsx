import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ImageCard from "@/components/ui/image-card";

describe("ImageCard Component", () => {
  const mockProps = {
    id: "img_123",
    src: "/test-image.jpg",
    alt: "Skyline Photo",
    uploadedAt: new Date("2026-02-10"),
    onDelete: vi.fn(),
    onDownload: vi.fn(),
  };

  it("renders the image details correctly", () => {
    render(<ImageCard {...mockProps} />);

    expect(screen.getByText("Skyline Photo")).toBeInTheDocument();

    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("calls onDownload with correct arguments when download button is clicked", () => {
    render(<ImageCard {...mockProps} />);

    const downloadBtn = screen.getByLabelText(/download image/i);
    fireEvent.click(downloadBtn);

    expect(mockProps.onDownload).toHaveBeenCalledWith(
      "img_123",
      "Skyline Photo",
    );
  });

  it("calls onDelete when the trash button is clicked", () => {
    render(<ImageCard {...mockProps} />);

    const deleteBtn = screen.getByLabelText(/delete image/i);
    fireEvent.click(deleteBtn);

    expect(mockProps.onDelete).toHaveBeenCalledWith("img_123");
  });

  it("has the correct hover transition classes", () => {
    const { container } = render(<ImageCard {...mockProps} />);
    const cardDiv = container.firstChild as HTMLElement;

    expect(cardDiv).toHaveClass("group");
    expect(cardDiv).toHaveClass("hover:shadow-xl");
  });
});
