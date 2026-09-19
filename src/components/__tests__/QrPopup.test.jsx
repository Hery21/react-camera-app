import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import QrPopup from "../QrPopup";

const longMessage = Array.from({ length: 8 }, (_, i) => `Line ${i + 1}`).join(
  "\n",
);

describe("QrPopup", () => {
  it("renders nothing when there is no message", () => {
    const { container } = render(<QrPopup message={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for an empty string message", () => {
    const { container } = render(<QrPopup message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the message text inside a dialog when a message is provided", () => {
    render(<QrPopup message="Server Rack A - Data Center Floor 2" />);
    expect(
      screen.getByText("Server Rack A - Data Center Floor 2"),
    ).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders a dimming overlay behind the textbox", () => {
    render(<QrPopup message="Server Rack A" />);
    expect(document.querySelector(".qr-popup-overlay")).toBeInTheDocument();
  });

  it("shows the press-A-to-close indicator when the whole message fits on screen", () => {
    render(<QrPopup message="Short message" />);
    expect(screen.getByLabelText(/press a to close/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/more text below/i)).not.toBeInTheDocument();
  });

  it("shows the blinking down-arrow indicator instead, when there are more lines below", () => {
    render(<QrPopup message={longMessage} />);
    expect(screen.getByLabelText(/more text below/i)).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/press a to close/i),
    ).not.toBeInTheDocument();
  });

  it("only shows the visible slice of lines for the current scrollOffset", () => {
    render(<QrPopup message={longMessage} scrollOffset={0} />);
    expect(screen.getByText("Line 1")).toBeInTheDocument();
    expect(screen.queryByText("Line 6")).not.toBeInTheDocument();
  });

  it("shows the close indicator once scrolled all the way to the end", () => {
    // 8 lines, 5 max visible => last valid scrollOffset is 3.
    render(<QrPopup message={longMessage} scrollOffset={3} />);
    expect(screen.getByText("Line 8")).toBeInTheDocument();
    expect(screen.getByLabelText(/press a to close/i)).toBeInTheDocument();
  });

  it("never shows both indicators at once", () => {
    render(<QrPopup message={longMessage} scrollOffset={1} />);
    const indicators = document.querySelectorAll(".qr-popup-indicator");
    expect(indicators).toHaveLength(1);
  });
});
