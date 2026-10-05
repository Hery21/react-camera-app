import { render, screen } from '@testing-library/react-native';
import PixelText from '../pixel-text';

describe('PixelText', () => {
  it('disables OS font scaling by default', () => {
    render(<PixelText>Hello</PixelText>);
    expect(screen.getByText('Hello').props.allowFontScaling).toBe(false);
  });

  it('still allows the caller to opt back into font scaling explicitly', () => {
    render(<PixelText allowFontScaling>Hello</PixelText>);
    expect(screen.getByText('Hello').props.allowFontScaling).toBe(true);
  });

  it('passes through all other Text props unchanged', () => {
    render(<PixelText style={{ color: 'red' }}>Hello</PixelText>);
    expect(screen.getByText('Hello').props.style).toEqual({ color: 'red' });
  });
});
