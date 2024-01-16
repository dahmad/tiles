import { screen } from '@testing-library/react';
import sinon from 'sinon';
import App from './App';
import { mockTilesStore, renderWithMockProvider } from './testHelpers';

afterEach(() => {
  sinon.restore();
});

test('renders', async () => {
  const { tilesStore } = await mockTilesStore();
  renderWithMockProvider(<App />, { tilesStore });
  expect(screen.getAllByRole('button').length).toEqual(4);
  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
});

test('does not render tile set when undefined', async () => {
  const { tilesStore } = await mockTilesStore();
  tilesStore.tileSet = undefined;
  renderWithMockProvider(<App />, { tilesStore });
  expect(screen.queryAllByRole('button').length).toEqual(0);
  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
});
