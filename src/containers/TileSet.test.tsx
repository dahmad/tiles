import { screen } from '@testing-library/react';
import sinon from 'sinon';
import {
  mockTileSetData,
  mockTilesStore,
  renderWithMockProvider,
} from '../testHelpers';
import TileSet from './TileSet';

afterEach(() => {
  sinon.restore();
});

test('renders rows of tiles', async () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
  ]);
  const tilesStore = await mockTilesStore(mockTileSet);
  renderWithMockProvider(<TileSet />, { tilesStore });
  expect(screen.getAllByRole('button').length).toEqual(2);
});
