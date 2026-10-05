import { render, screen, fireEvent } from '@testing-library/react-native';
import Controls from '../controls';

const noop = () => {};
const TEST_UNIT = 4;

describe('Controls', () => {
  it('always renders the X button, even when onB is not provided', () => {
    // Previously X was removed from the tree entirely when onB was
    // undefined (e.g. on the Welcome/Menu screens) - this is the
    // regression test for that bug: X must always be in the tree.
    render(<Controls onA={noop} unit={TEST_UNIT} aLabel="Snap" bLabel="Close" />);
    expect(screen.getByLabelText('Close')).toBeTruthy();
  });

  it('marks the X button as disabled when onB is not provided', () => {
    render(<Controls onA={noop} unit={TEST_UNIT} aLabel="Snap" bLabel="Close" />);
    expect(screen.getByLabelText('Close').props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );
  });

  it('does not call anything when the disabled X button is pressed', () => {
    render(<Controls onA={noop} unit={TEST_UNIT} aLabel="Snap" bLabel="Close" />);
    // Should not throw even with no onB handler at all.
    expect(() => fireEvent.press(screen.getByLabelText('Close'))).not.toThrow();
  });

  it('enables the X button and calls onB when onB is provided', () => {
    const onB = jest.fn();
    render(<Controls onA={noop} onB={onB} unit={TEST_UNIT} aLabel="Snap" bLabel="Close" />);
    const xButton = screen.getByLabelText('Close');
    expect(xButton.props.accessibilityState).toEqual(expect.objectContaining({ disabled: false }));
    fireEvent.press(xButton);
    expect(onB).toHaveBeenCalledTimes(1);
  });

  it('always renders the Y button and calls onA when pressed', () => {
    const onA = jest.fn();
    render(<Controls onA={onA} unit={TEST_UNIT} aLabel="Snap" bLabel="Close" />);
    fireEvent.press(screen.getByLabelText('Snap'));
    expect(onA).toHaveBeenCalledTimes(1);
  });

  it('renders the decorative left/right glyphs at full opacity (not dimmed)', () => {
    render(<Controls onA={noop} unit={TEST_UNIT} aLabel="Snap" bLabel="Close" />);
    const left = screen.getByText('◀');
    const right = screen.getByText('▶');
    // Flatten in case the style is an array; there should be no opacity
    // property at all now that glyphDim was removed, not just opacity: 1.
    const flatten = (style: unknown) =>
      Array.isArray(style) ? Object.assign({}, ...style) : style;
    expect(flatten(left.props.style).opacity).toBeUndefined();
    expect(flatten(right.props.style).opacity).toBeUndefined();
  });
});
