import { screen } from '@testing-library/react';
import sinon from 'sinon';
import { mockTilesStore, renderWithMockProvider } from '../testHelpers';
import TileRow from './TileRow';

afterEach(() => {
  sinon.restore();
});

test('renders row of tiles', async () => {
  const { tilesStore } = await mockTilesStore();
  renderWithMockProvider(<TileRow rowIndex={0} />, { tilesStore });
  expect(screen.getAllByRole('button').length).toEqual(2);
});
