import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import CameraScreen from "../../../app/camera";
import StartMenu from "../start-menu";

jest.mock("@expo-google-fonts/press-start-2p", () => ({
  PressStart2P_400Regular: "PressStart2P_400Regular",
  useFonts: () => [true],
}));

jest.mock("@/hooks/use-camera-permission", () => ({
  useCameraPermission: () => ({
    isGranted: true,
    isLoading: false,
    requestPermission: jest.fn(),
  }),
}));

jest.mock("@/hooks/use-game-boy-metrics", () => ({
  useGameBoyMetrics: () => ({ width: 400, height: 600, unit: 4 }),
}));

jest.mock("@/constants/theme", () => ({
  BottomTabInset: 0,
  Spacing: { four: 24 },
}));

jest.mock("@/constants/game-boy-theme", () => ({
  GAME_BOY_COLORS: {
    shellA: "#000000",
    shellB: "#111111",
    shellC: "#222222",
    bezel: "#333333",
    screenBottom: "#444444",
    xBtn: ["#555555", "#666666", "#777777"],
    yBtn: ["#888888", "#999999", "#aaaaaa"],
  },
  GAME_BOY_FONT_FAMILY: "monospace",
}));

const OPTIONS = [
  { value: "tour", label: "Start Tour" },
  { value: "photo", label: "Take Photos" },
];

// `unit` is now required (see styles/start-menu.styles.ts). A fixed
// test value is fine - these tests assert content/behavior, not pixels.
const TEST_UNIT = 4;

describe("StartMenu", () => {
  it("renders every option label", () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} unit={TEST_UNIT} />);
    expect(screen.getByText("Start Tour")).toBeTruthy();
    expect(screen.getByText("Take Photos")).toBeTruthy();
  });

  it("renders a cursor element for every row and toggles its visibility via opacity", () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} unit={TEST_UNIT} />);

    const cursorNodes = screen.UNSAFE_getAllByType(Text).filter((node) => {
      const children = node.props.children;
      return Array.isArray(children)
        ? children.some((child) => child && child.type === "img")
        : children && children.type === "img";
    });

    expect(cursorNodes).toHaveLength(OPTIONS.length);
    expect(cursorNodes[0].props.style).toEqual(
      expect.not.objectContaining({ opacity: 0 }),
    );
  });

  it("moves the visually-selected option when selectedIndex changes", () => {
    const { rerender } = render(
      <StartMenu options={OPTIONS} selectedIndex={0} unit={TEST_UNIT} />,
    );
    expect(screen.getByText("Start Tour").props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: "underline" }),
      ]),
    );

    rerender(
      <StartMenu options={OPTIONS} selectedIndex={1} unit={TEST_UNIT} />,
    );
    expect(screen.getByText("Take Photos").props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textDecorationLine: "underline" }),
      ]),
    );
  });

  it("renders the control hint text", () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} unit={TEST_UNIT} />);
    expect(screen.getByText(/Choose/)).toBeTruthy();
  });

  it("enables the X button in the start menu and returns to the welcome screen when pressed", () => {
    render(<CameraScreen />);

    fireEvent.press(screen.getAllByLabelText("Start")[0]);

    const backButton = screen.getByLabelText("Back");
    expect(backButton.props.accessibilityState).toMatchObject({
      disabled: false,
    });

    fireEvent.press(backButton);

    expect(screen.getByText("PRESS START")).toBeTruthy();
  });
});
