import { act, screen } from '@testing-library/react';
import ComboStore from '../ComboStore';
import { renderWithMockProvider } from '../testHelpers';
import ComboCounts from './ComboCounts';

test('renders combo counts', () => {
  const comboStore = new ComboStore([[]]);

  renderWithMockProvider(<ComboCounts />, { comboStore });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/0/i).length).toEqual(2);

  act(() => {
    comboStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/1/i).length).toEqual(2);

  act(() => {
    comboStore.resetCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/0/i).length).toEqual(1);
  expect(screen.getAllByText(/1/i).length).toEqual(1);

  act(() => {
    comboStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/1/i).length).toEqual(2);

  act(() => {
    comboStore.incrementCurrentComboCounter();
  });

  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
  expect(screen.getAllByText(/2/i).length).toEqual(2);
});
