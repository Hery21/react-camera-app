import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QrPopup from "../QrPopup";

describe("QrPopup", () => {
  it("renders nothing when there is no message", () => {
    const { container } = render(<QrPopup message={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for an empty string message", () => {
    const { container } = render(<QrPopup message="" onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the message text and a dialog role when a message is provided", () => {
    render(
      <QrPopup
        message="Server Rack A - Data Center Floor 2"
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Server Rack A - Data Center Floor 2"),
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onClose exactly once when OK is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<QrPopup message="Server Rack A" onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /ok/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
