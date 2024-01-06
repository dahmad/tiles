import { act, screen } from '@testing-library/react';
import TilesStore from '../TilesStore';
import { renderWithMockProvider } from '../testHelpers';
import LongestCombo from './LongestCombo';

test('renders longest combo count', () => {
  const tilesStore = new TilesStore([[]]);

  renderWithMockProvider(<LongestCombo />, { tilesStore });

  // Longest combo count follows current count at start
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/0/i)).toBeInTheDocument();

  act(() => {
    tilesStore.incrementCurrentComboCounter();
    tilesStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/2/i)).toBeInTheDocument();

  // Longest combo count is retained after current combo count is reset
  act(() => {
    tilesStore.resetCurrentComboCounter();
  });

  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/2/i)).toBeInTheDocument();

  // Longest combo count is retained while current count is less than longest
  act(() => {
    tilesStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/2/i)).toBeInTheDocument();

  // Longest combo count is updated when current count surpasses previous longest
  act(() => {
    tilesStore.incrementCurrentComboCounter();
    tilesStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getByText(/3/i)).toBeInTheDocument();
});
