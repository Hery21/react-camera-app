import { render, screen } from "@testing-library/react-native";
import PhotoPreview from "../photo-preview";

describe("PhotoPreview", () => {
  it("renders nothing when hasPhoto is false", () => {
    const { toJSON } = render(
      <PhotoPreview photoUri={null} hasPhoto={false} />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders nothing when hasPhoto is true but there is no photoUri (edge case)", () => {
    const { toJSON } = render(<PhotoPreview photoUri={null} hasPhoto />);
    expect(toJSON()).toBeNull();
  });

  it("renders the photo image when hasPhoto is true and a uri is provided", () => {
    render(<PhotoPreview photoUri="file:///fake/photo.jpg" hasPhoto />);
    expect(screen.getByRole("image")).toBeTruthy();
  });
});
