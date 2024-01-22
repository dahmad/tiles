import { fireEvent, screen } from '@testing-library/react';
import sinon from 'sinon';
import { mockTilesStore, renderWithMockProvider } from '../testHelpers';
import Tile from './Tile';

afterEach(() => {
  sinon.restore();
});

test('renders', async () => {
  const { tilesStore } = await mockTilesStore();
  renderWithMockProvider(<Tile rowIndex={0} columnIndex={0} />, { tilesStore });

  expect(screen.getAllByRole('button').length).toEqual(1);
  expect(screen.getAllByRole('img').length).toEqual(2);
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('clicking a tile selects it', async () => {
  const { tilesStore } = await mockTilesStore();
  renderWithMockProvider(<Tile rowIndex={1} columnIndex={1} />, { tilesStore });

  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(tilesStore.firstTile).toEqual([1, 1]);
  expect(button).toHaveClass('selected');
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('renders chip', async () => {
  const { tilesStore } = await mockTilesStore();
  tilesStore.isAnimating = true;
  tilesStore.setActiveTile(0, 0);
  tilesStore.chipText = 'foo';
  renderWithMockProvider(<Tile rowIndex={0} columnIndex={0} />, { tilesStore });
  expect(screen.getByRole('dialog')).toBeDefined();
});

test('shows no layers when tileSet is undefined', async () => {
  const { tilesStore } = await mockTilesStore();
  tilesStore.tileSet = undefined;
  renderWithMockProvider(<Tile rowIndex={0} columnIndex={0} />, { tilesStore });
  expect(screen.getAllByRole('button').length).toEqual(1);
  expect(screen.queryAllByRole('img').length).toEqual(0);
  expect(screen.queryByRole('dialog')).toBeNull();
});
