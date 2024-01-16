import { fireEvent, screen } from '@testing-library/react';
import sinon from 'sinon';
import {
  mockTileSetData,
  mockTilesStore,
  renderWithMockProvider,
} from '../testHelpers';
import Tile from './Tile';

afterEach(() => {
  sinon.restore();
});

test('renders', async () => {
  const mockTileSet = mockTileSetData([[['a', 'b']]]);
  const tilesStore = await mockTilesStore(mockTileSet);

  renderWithMockProvider(<Tile rowIndex={0} columnIndex={0} />, { tilesStore });

  expect(screen.getAllByRole('button').length).toEqual(1);
  expect(screen.getAllByRole('img').length).toEqual(2);
});

test('clicking a tile selects it', async () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['a', 'b'],
    ],
    [
      ['a', 'b'],
      ['a', 'b'],
    ],
  ]);
  const tilesStore = await mockTilesStore(mockTileSet);
  renderWithMockProvider(<Tile rowIndex={1} columnIndex={1} />, { tilesStore });

  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(tilesStore.selectedTileIndex).toEqual([1, 1]);
  expect(button).toHaveClass('selected');
});
