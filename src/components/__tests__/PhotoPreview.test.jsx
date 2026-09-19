import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PhotoPreview from "../PhotoPreview";

describe("PhotoPreview", () => {
  it("renders the canvas element", () => {
    render(<PhotoPreview photoRef={{ current: null }} hasPhoto={false} />);
    expect(document.querySelector("canvas")).toBeInTheDocument();
  });

  it("does not apply the hasPhoto class before a photo is taken", () => {
    render(<PhotoPreview photoRef={{ current: null }} hasPhoto={false} />);
    const wrapper = document.querySelector(".result");
    expect(wrapper).toHaveClass("result");
    expect(wrapper).not.toHaveClass("hasPhoto");
  });

  it("applies the hasPhoto class once a photo has been taken", () => {
    render(<PhotoPreview photoRef={{ current: null }} hasPhoto={true} />);
    expect(document.querySelector(".result")).toHaveClass("result", "hasPhoto");
  });
});
