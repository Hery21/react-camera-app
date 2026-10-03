import { render, screen } from '@testing-library/react-native';
import WelcomeScreen from '../welcome-screen';
import { APP_NAME, APP_TAGLINE } from '@/constants/branding';

describe('WelcomeScreen', () => {
  it('renders the default app name and tagline from the branding constants', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText(APP_NAME)).toBeTruthy();
    expect(screen.getByText(APP_TAGLINE)).toBeTruthy();
  });

  it('renders a custom app name and tagline when passed as props', () => {
    render(<WelcomeScreen appName="TEST CAM" tagline="A TEST TAGLINE" />);
    expect(screen.getByText('TEST CAM')).toBeTruthy();
    expect(screen.getByText('A TEST TAGLINE')).toBeTruthy();
  });

  it('renders the press-start prompt', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText('PRESS START')).toBeTruthy();
  });
});
