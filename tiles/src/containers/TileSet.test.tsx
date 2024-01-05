import { render, screen } from '@testing-library/react';
import { RootContextProvider } from '../RootContext';
import { mockTileSetData } from '../testHelpers';
import TileSet from './TileSet';

test('renders rows of tiles', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
  ]);

  render(
    <RootContextProvider tileSetData={mockTileSet}>
      <TileSet />
    </RootContextProvider>
  );

  expect(screen.getAllByRole('button').length).toEqual(2);
});
