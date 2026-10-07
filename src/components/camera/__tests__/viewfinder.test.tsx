import { render, screen } from "@testing-library/react-native";
import { CameraView } from "expo-camera";
import Viewfinder from "../viewfinder";

// expo-camera's native module isn't available under Jest by default -
// jest-expo's preset provides a mock for <CameraView>, so no manual
// mock is needed here as long as the jest-expo preset is configured
// (see MIGRATION.md).
describe("Viewfinder", () => {
  it("renders the error message when an error is provided, instead of the camera", () => {
    render(
      <Viewfinder
        unit={4}
        error="Permission denied"
        scanningEnabled
        onBarcodeScanned={() => {}}
      />,
    );
    expect(screen.getByText("Permission denied")).toBeTruthy();
  });

  it("does not render the error message when there is no error", () => {
    // Previously asserted "no text at all renders" - that's no longer
    // accurate now that a legitimate "SCANNING" HUD label is part of the
    // game-like overlay (see below). The actual intent of this test -
    // no error leaking through when the camera is active - is preserved
    // by asserting the specific error text is absent instead.
    render(
      <Viewfinder
        unit={4}
        error={null}
        scanningEnabled
        onBarcodeScanned={() => {}}
      />,
    );
    expect(screen.queryByText("Permission denied")).toBeNull();
  });

  it("renders the blinking SCANNING HUD label while the camera is active", () => {
    render(
      <Viewfinder
        unit={4}
        error={null}
        scanningEnabled
        onBarcodeScanned={() => {}}
      />,
    );
    expect(screen.getByText("SCANNING")).toBeTruthy();
  });

  it("renders a camera overlay when the camera is active", () => {
    render(
      <Viewfinder
        unit={4}
        error={null}
        scanningEnabled
        onBarcodeScanned={() => {}}
      />,
    );
    expect(screen.getByTestId("camera-overlay")).toBeTruthy();
  });

  it("fills the available screen area when the camera is active", () => {
    render(
      <Viewfinder
        unit={4}
        error={null}
        scanningEnabled
        onBarcodeScanned={() => {}}
      />,
    );
    const camera = screen.UNSAFE_getByType(CameraView);
    expect(camera.props.style).toEqual(
      expect.objectContaining({ flex: 1, width: "100%", height: "100%" }),
    );
  });
});
