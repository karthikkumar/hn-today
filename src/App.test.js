import { render, screen } from '@testing-library/react';
import App from './App';

test('renders opening screen', () => {
  render(<App />);
  const openElement = screen.getByText(/opening/i);
  expect(openElement).toBeInTheDocument();
});
