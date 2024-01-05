import { render, screen } from '@testing-library/react';
import { RootContextProvider } from '../RootContext';
import { mockTileSetData } from '../testHelpers';
import TileRow from './TileRow';

test('renders row of tiles', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
  ]);

  render(
    <RootContextProvider tileSetData={mockTileSet}>
      <TileRow rowIndex={0} />
    </RootContextProvider>
  );

  expect(screen.getAllByRole('button').length).toEqual(2);
});

test('does not render other rows of tiles', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
    ],
    [
      ['c', 'd'],
    ],
  ]);

  render(
    <RootContextProvider tileSetData={mockTileSet}>
      <TileRow rowIndex={0} />
    </RootContextProvider>
  );

  expect(screen.getAllByRole('button').length).toEqual(1);
});
