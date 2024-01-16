import { screen } from '@testing-library/react';
import sinon from 'sinon';
import {
  mockTileSetData,
  mockTilesStore,
  renderWithMockProvider,
} from '../testHelpers';
import TileRow from './TileRow';

afterEach(() => {
  sinon.restore();
});

test('renders row of tiles', async () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
  ]);
  const tilesStore = await mockTilesStore(mockTileSet);
  renderWithMockProvider(<TileRow rowIndex={0} />, { tilesStore });
  expect(screen.getAllByRole('button').length).toEqual(2);
});

test('does not render other rows of tiles', async () => {
  const mockTileSet = mockTileSetData([[['a', 'b']], [['c', 'd']]]);
  const tilesStore = await mockTilesStore(mockTileSet);
  renderWithMockProvider(<TileRow rowIndex={0} />, { tilesStore });
  expect(screen.getAllByRole('button').length).toEqual(1);
});
