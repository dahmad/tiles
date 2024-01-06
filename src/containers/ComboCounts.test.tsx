import { act, screen } from '@testing-library/react';
import TilesStore from '../TilesStore';
import { renderWithMockProvider } from '../testHelpers';
import ComboCounts from './ComboCounts';

test('renders combo counts', () => {
  const tilesStore = new TilesStore([[]]);

  renderWithMockProvider(<ComboCounts />, { tilesStore });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/0/i).length).toEqual(2);

  act(() => {
    tilesStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/1/i).length).toEqual(2);

  act(() => {
    tilesStore.resetCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/0/i).length).toEqual(1);
  expect(screen.getAllByText(/1/i).length).toEqual(1);

  act(() => {
    tilesStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/1/i).length).toEqual(2);

  act(() => {
    tilesStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/2/i).length).toEqual(2);
});
