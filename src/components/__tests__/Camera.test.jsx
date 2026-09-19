import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Camera from "../Camera";

describe("Camera", () => {
  it("renders the video element", () => {
    render(<Camera videoRef={{ current: null }} />);
    expect(document.querySelector("video")).toBeInTheDocument();
  });

  it("does not render an error message when there is no error", () => {
    render(<Camera videoRef={{ current: null }} error={null} />);
    expect(document.querySelector(".camera-error")).not.toBeInTheDocument();
  });

  it("renders the error message when the camera hook reports one", () => {
    render(<Camera videoRef={{ current: null }} error="Permission denied" />);
    expect(screen.getByText("Permission denied")).toBeInTheDocument();
  });

  it("renders an empty error string as no error (falsy edge case)", () => {
    render(<Camera videoRef={{ current: null }} error="" />);
    expect(document.querySelector(".camera-error")).not.toBeInTheDocument();
  });
});
