import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoPreview from "../PhotoPreview";

describe("PhotoPreview", () => {
  it("renders the canvas and the CLOSE button", () => {
    render(
      <PhotoPreview
        photoRef={{ current: null }}
        hasPhoto={false}
        onClose={vi.fn()}
      />,
    );

    expect(document.querySelector("canvas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("does not apply the hasPhoto class before a photo is taken", () => {
    render(
      <PhotoPreview
        photoRef={{ current: null }}
        hasPhoto={false}
        onClose={vi.fn()}
      />,
    );

    const wrapper = document.querySelector(".result");
    expect(wrapper).toHaveClass("result");
    expect(wrapper).not.toHaveClass("hasPhoto");
  });

  it("applies the hasPhoto class once a photo has been taken", () => {
    render(
      <PhotoPreview
        photoRef={{ current: null }}
        hasPhoto={true}
        onClose={vi.fn()}
      />,
    );

    expect(document.querySelector(".result")).toHaveClass("result", "hasPhoto");
  });

  it("calls onClose exactly once per click", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <PhotoPreview
        photoRef={{ current: null }}
        hasPhoto={true}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
