import { render, screen } from "@testing-library/react-native";
import QrPopup from "../qr-popup";

const longMessage = Array.from({ length: 8 }, (_, i) => `Line ${i + 1}`).join(
  "\n",
);

describe("QrPopup", () => {
  it("renders nothing when there is no message", () => {
    const { toJSON } = render(<QrPopup message={null} />);
    expect(toJSON()).toBeNull();
  });

  it("renders nothing for an empty string message", () => {
    const { toJSON } = render(<QrPopup message="" />);
    expect(toJSON()).toBeNull();
  });

  it("renders the message text when a message is provided", () => {
    render(<QrPopup message="Server Rack A - Data Center Floor 2" />);
    expect(
      screen.getByText("Server Rack A - Data Center Floor 2"),
    ).toBeTruthy();
  });

  it("shows the press-Y-to-close indicator when the whole message fits on screen", () => {
    render(<QrPopup message="Short message" />);
    expect(screen.getByLabelText("Press Y to close")).toBeTruthy();
    expect(screen.queryByLabelText("More text below, scroll down")).toBeNull();
  });

  it("shows the down-arrow indicator instead, when there are more lines below", () => {
    render(<QrPopup message={longMessage} />);
    expect(screen.getByLabelText("More text below, scroll down")).toBeTruthy();
    expect(screen.queryByLabelText("Press Y to close")).toBeNull();
  });

  it("only shows the visible slice of lines for the current scrollOffset", () => {
    render(<QrPopup message={longMessage} scrollOffset={0} />);
    expect(screen.getByText("Line 1")).toBeTruthy();
    expect(screen.queryByText("Line 6")).toBeNull();
  });

  it("shows the close indicator once scrolled all the way to the end", () => {
    render(<QrPopup message={longMessage} scrollOffset={3} />);
    expect(screen.getByText("Line 8")).toBeTruthy();
    expect(screen.getByLabelText("Press Y to close")).toBeTruthy();
  });
});
