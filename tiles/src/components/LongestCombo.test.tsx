import { act, screen } from '@testing-library/react';
import ComboStore from '../ComboStore';
import { renderWithMockProvider } from '../testHelpers';
import LongestCombo from './LongestCombo';

test('renders longest combo count', () => {
  const comboStore = new ComboStore([[]]);

  renderWithMockProvider(<LongestCombo />, { comboStore });

  // Longest combo count follows current count at start
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/0/i)).toBeInTheDocument();

  act(() => {
    comboStore.incrementCurrentComboCounter();
    comboStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/2/i)).toBeInTheDocument();

  // Longest combo count is retained after current combo count is reset
  act(() => {
    comboStore.resetCurrentComboCounter();
  });

  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/2/i)).toBeInTheDocument();

  // Longest combo count is retained while current count is less than longest
  act(() => {
    comboStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/2/i)).toBeInTheDocument();

  // Longest combo count is updated when current count surpasses previous longest
  act(() => {
    comboStore.incrementCurrentComboCounter();
    comboStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/3/i)).toBeInTheDocument();
});
