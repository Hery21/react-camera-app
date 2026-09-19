import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Camera from "../Camera";

describe("Camera", () => {
  it("renders the video element and the SNAP button", () => {
    render(<Camera videoRef={{ current: null }} onSnap={vi.fn()} />);

    expect(document.querySelector("video")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /snap/i })).toBeInTheDocument();
  });

  it("calls onSnap exactly once per click", async () => {
    const onSnap = vi.fn();
    const user = userEvent.setup();
    render(<Camera videoRef={{ current: null }} onSnap={onSnap} />);

    await user.click(screen.getByRole("button", { name: /snap/i }));
    expect(onSnap).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /snap/i }));
    expect(onSnap).toHaveBeenCalledTimes(2);
  });

  it("does not render an error message when there is no error", () => {
    render(
      <Camera videoRef={{ current: null }} onSnap={vi.fn()} error={null} />,
    );
    expect(
      screen.queryByText(/.+/, { selector: ".camera-error" }),
    ).not.toBeInTheDocument();
  });

  it("renders the error message when the camera hook reports one", () => {
    render(
      <Camera
        videoRef={{ current: null }}
        onSnap={vi.fn()}
        error="Permission denied"
      />,
    );
    expect(screen.getByText("Permission denied")).toBeInTheDocument();
  });

  it("renders an empty error string as no error (falsy edge case)", () => {
    render(<Camera videoRef={{ current: null }} onSnap={vi.fn()} error="" />);
    expect(document.querySelector(".camera-error")).not.toBeInTheDocument();
  });
});
