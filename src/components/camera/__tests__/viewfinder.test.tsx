import { render, screen } from "@testing-library/react-native";
import Viewfinder from "../viewfinder";

// expo-camera's native module isn't available under Jest by default -
// jest-expo's preset provides a mock for <CameraView>, so no manual
// mock is needed here as long as the jest-expo preset is configured
// (see MIGRATION.md).

describe("Viewfinder", () => {
  it("renders the error message when an error is provided, instead of the camera", () => {
    render(
      <Viewfinder
        error="Permission denied"
        scanningEnabled
        onBarcodeScanned={() => {}}
      />,
    );
    expect(screen.getByText("Permission denied")).toBeTruthy();
  });

  it("renders no error text when there is no error", () => {
    render(
      <Viewfinder error={null} scanningEnabled onBarcodeScanned={() => {}} />,
    );
    expect(screen.queryByText(/.+/)).toBeNull();
  });
});
