import { screen } from '@testing-library/react';
import sinon from 'sinon';
import { mockTilesStore, renderWithMockProvider } from '../testHelpers';
import TileSet from './TileSet';

afterEach(() => {
  sinon.restore();
});

test('renders set of tiles', async () => {
  const { tilesStore } = await mockTilesStore();
  renderWithMockProvider(<TileSet />, { tilesStore });
  expect(screen.getAllByRole('button').length).toEqual(4);
});
