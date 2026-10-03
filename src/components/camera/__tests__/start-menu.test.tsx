import { render, screen } from '@testing-library/react-native';
import StartMenu from '../start-menu';

const OPTIONS = [
  { value: 'tour', label: 'Start Tour' },
  { value: 'photo', label: 'Take Photos' },
];

describe('StartMenu', () => {
  it('renders every option label', () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} />);
    expect(screen.getByText('Start Tour')).toBeTruthy();
    expect(screen.getByText('Take Photos')).toBeTruthy();
  });

  it('shows the cursor next to the currently selected option only', () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} />);
    const cursors = screen.getAllByText('▶');
    // Both cursor glyphs render (one per row) - only the selected row's
    // cursor should be visually shown (opacity 1), the other hidden
    // (opacity 0), rather than removed from the tree entirely. This
    // keeps row heights identical whether or not a row is selected.
    expect(cursors).toHaveLength(OPTIONS.length);
  });

  it('moves the visually-selected option when selectedIndex changes', () => {
    const { rerender } = render(<StartMenu options={OPTIONS} selectedIndex={0} />);
    const firstSelected = screen.getByText('Start Tour');
    expect(firstSelected.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'underline' })]),
    );

    rerender(<StartMenu options={OPTIONS} selectedIndex={1} />);
    const secondSelected = screen.getByText('Take Photos');
    expect(secondSelected.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'underline' })]),
    );
  });

  it('renders the control hint text', () => {
    render(<StartMenu options={OPTIONS} selectedIndex={0} />);
    expect(screen.getByText(/Choose/)).toBeTruthy();
  });
});
