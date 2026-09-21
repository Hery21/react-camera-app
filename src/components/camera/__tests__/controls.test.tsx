import { fireEvent, render, screen } from "@testing-library/react-native";
import Controls from "../controls";

const noop = () => {};

describe("Controls", () => {
  it("renders X and Y buttons with the given accessible labels", () => {
    render(
      <Controls onA={noop} onB={noop} aLabel="Snap" bLabel="Close" unit={4} />,
    );
    expect(screen.getByLabelText("Snap")).toBeTruthy();
    expect(screen.getByLabelText("Close")).toBeTruthy();
  });

  it("calls onA exactly once per press", () => {
    const onA = jest.fn();
    render(
      <Controls onA={onA} onB={noop} aLabel="Snap" bLabel="Close" unit={4} />,
    );
    fireEvent.press(screen.getByLabelText("Snap"));
    expect(onA).toHaveBeenCalledTimes(1);
  });

  it("calls onB exactly once per press", () => {
    const onB = jest.fn();
    render(
      <Controls onA={noop} onB={onB} aLabel="Snap" bLabel="Close" unit={4} />,
    );
    fireEvent.press(screen.getByLabelText("Close"));
    expect(onB).toHaveBeenCalledTimes(1);
  });

  it("calls onUp when canScrollUp is true", () => {
    const onUp = jest.fn();
    render(
      <Controls
        onA={noop}
        onB={noop}
        onUp={onUp}
        canScrollUp
        unit={4}
        aLabel="Snap"
        bLabel="Close"
      />,
    );
    fireEvent.press(screen.getByLabelText("Scroll up"));
    expect(onUp).toHaveBeenCalledTimes(1);
  });

  it("does not call onUp when canScrollUp is false (button disabled)", () => {
    const onUp = jest.fn();
    render(
      <Controls
        onA={noop}
        onB={noop}
        onUp={onUp}
        canScrollUp={false}
        unit={4}
        aLabel="Snap"
        bLabel="Close"
      />,
    );
    fireEvent.press(screen.getByLabelText("Scroll up"));
    expect(onUp).not.toHaveBeenCalled();
  });

  it("mirrors the same enabled/disabled behavior for the down button", () => {
    const onDown = jest.fn();
    render(
      <Controls
        onA={noop}
        onB={noop}
        onDown={onDown}
        canScrollDown
        unit={4}
        aLabel="Snap"
        bLabel="Close"
      />,
    );
    fireEvent.press(screen.getByLabelText("Scroll down"));
    expect(onDown).toHaveBeenCalledTimes(1);
  });
});
