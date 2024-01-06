import { fireEvent, render, screen } from '@testing-library/react';
import TilesStore from '../TilesStore';
import { RootContextProvider } from '../RootContext';
import { mockTileSetData, renderWithMockProvider } from '../testHelpers';
import Tile from './Tile';

test('renders', () => {
  const mockTileSet = mockTileSetData([[['a', 'b']]]);

  render(
    <RootContextProvider tileSetData={mockTileSet}>
      <Tile rowIndex={0} columnIndex={0} />
    </RootContextProvider>
  );

  expect(screen.getAllByRole('button').length).toEqual(1);
  expect(screen.getAllByRole('img').length).toEqual(2);
});

test('clicking a tile selects it', () => {
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
  const tilesStore = new TilesStore(mockTileSet);
  renderWithMockProvider(<Tile rowIndex={1} columnIndex={1} />, { tilesStore });

  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(tilesStore.selectedTileIndex).toEqual([1, 1]);
  expect(button).toHaveClass('selected');
});
