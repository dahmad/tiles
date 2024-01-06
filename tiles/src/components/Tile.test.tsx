import { render, screen } from '@testing-library/react';
import { RootContextProvider } from '../RootContext';
import { mockTileSetData } from '../testHelpers';
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
