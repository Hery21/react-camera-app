import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Controls from "../Controls";

const noop = () => {};

describe("Controls", () => {
  it("renders A and B buttons with the given accessible labels", () => {
    render(<Controls onA={noop} onB={noop} aLabel="Snap" bLabel="Close" />);
    expect(screen.getByRole("button", { name: "Snap" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("calls onA exactly once per click", async () => {
    const onA = vi.fn();
    const user = userEvent.setup();
    render(<Controls onA={onA} onB={noop} aLabel="Snap" bLabel="Close" />);

    await user.click(screen.getByRole("button", { name: "Snap" }));
    expect(onA).toHaveBeenCalledOnce();
  });

  it("calls onB exactly once per click", async () => {
    const onB = vi.fn();
    const user = userEvent.setup();
    render(<Controls onA={noop} onB={onB} aLabel="Snap" bLabel="Close" />);

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onB).toHaveBeenCalledOnce();
  });

  it("enables the up button and calls onUp when canScrollUp is true", async () => {
    const onUp = vi.fn();
    const user = userEvent.setup();
    render(<Controls onA={noop} onB={noop} onUp={onUp} canScrollUp aLabel="Snap" bLabel="Close" />);

    const up = screen.getByRole("button", { name: /scroll up/i });
    expect(up).toBeEnabled();
    await user.click(up);
    expect(onUp).toHaveBeenCalledOnce();
  });

  it("disables the up button and never calls onUp when canScrollUp is false", async () => {
    const onUp = vi.fn();
    const user = userEvent.setup();
    render(
      <Controls onA={noop} onB={noop} onUp={onUp} canScrollUp={false} aLabel="Snap" bLabel="Close" />
    );

    const up = screen.getByRole("button", { name: /scroll up/i });
    expect(up).toBeDisabled();
    await user.click(up);
    expect(onUp).not.toHaveBeenCalled();
  });

  it("mirrors the same enabled/disabled behavior for the down button", async () => {
    const onDown = vi.fn();
    const user = userEvent.setup();
    render(
      <Controls onA={noop} onB={noop} onDown={onDown} canScrollDown aLabel="Snap" bLabel="Close" />
    );

    const down = screen.getByRole("button", { name: /scroll down/i });
    expect(down).toBeEnabled();
    await user.click(down);
    expect(onDown).toHaveBeenCalledOnce();
  });

  it("disables the down button and never calls onDown when canScrollDown is false", async () => {
    const onDown = vi.fn();
    const user = userEvent.setup();
    render(
      <Controls onA={noop} onB={noop} onDown={onDown} canScrollDown={false} aLabel="Snap" bLabel="Close" />
    );

    const down = screen.getByRole("button", { name: /scroll down/i });
    expect(down).toBeDisabled();
    await user.click(down);
    expect(onDown).not.toHaveBeenCalled();
  });

  it("renders exactly 4 real buttons - up, down, A, B - and no more", () => {
    render(<Controls onA={noop} onB={noop} aLabel="Snap" bLabel="Close" />);
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("renders the decorative dpad arms (left/right/center) as non-interactive elements", () => {
    render(<Controls onA={noop} onB={noop} aLabel="Snap" bLabel="Close" />);
    expect(document.querySelector(".dpad-left")?.tagName).toBe("DIV");
    expect(document.querySelector(".dpad-right")?.tagName).toBe("DIV");
    expect(document.querySelector(".dpad-center")?.tagName).toBe("DIV");
  });
});
