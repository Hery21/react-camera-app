import { render, screen } from '@testing-library/react-native';
import StartMenu from '../start-menu';

const OPTIONS = [
  { value: 'tour', label: 'Start Tour' },
  { value: 'photo', label: 'Take Photos' },
];

// `unit` is now required (see styles/start-menu.styles.ts). A fixed
// test value is fine - these tests assert content/behavior, not pixels.
const TEST_UNIT = 4;

describe('StartMenu', () => {
  it('renders every option label', () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} unit={TEST_UNIT} />);
    expect(screen.getByText('Start Tour')).toBeTruthy();
    expect(screen.getByText('Take Photos')).toBeTruthy();
  });

  it('shows a cursor glyph for every row (visibility toggled via opacity, not removal)', () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} unit={TEST_UNIT} />);
    const cursors = screen.getAllByText('▶');
    expect(cursors).toHaveLength(OPTIONS.length);
  });

  it('moves the visually-selected option when selectedIndex changes', () => {
    const { rerender } = render(<StartMenu options={OPTIONS} selectedIndex={0} unit={TEST_UNIT} />);
    expect(screen.getByText('Start Tour').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'underline' })]),
    );

    rerender(<StartMenu options={OPTIONS} selectedIndex={1} unit={TEST_UNIT} />);
    expect(screen.getByText('Take Photos').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'underline' })]),
    );
  });

  it('renders the control hint text', () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} unit={TEST_UNIT} />);
    expect(screen.getByText(/Choose/)).toBeTruthy();
  });
});
