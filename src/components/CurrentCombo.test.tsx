import { act, screen } from '@testing-library/react';
import TilesStore from '../TilesStore';
import { renderWithMockProvider } from '../testHelpers';
import CurrentCombo from './CurrentCombo';

test('renders current combo count', () => {
  const tilesStore = new TilesStore();

  renderWithMockProvider(<CurrentCombo />, { tilesStore });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/0/i)).toBeInTheDocument();

  act(() => {
    tilesStore.incrementCurrentComboCounter();
    tilesStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/2/i)).toBeInTheDocument();
});
