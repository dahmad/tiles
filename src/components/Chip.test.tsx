import { screen } from '@testing-library/react';
import sinon from 'sinon';
import { mockTilesStore, renderWithMockProvider } from '../testHelpers';
import Chip from './Chip';

beforeEach(() => {
  sinon.restore();
});

test('renders chip', async () => {
  const { tilesStore } = await mockTilesStore();
  tilesStore.isAnimating = true;
  tilesStore.setActiveTile(0, 0);
  tilesStore.chipText = 'foo';
  renderWithMockProvider(<Chip rowIndex={0} columnIndex={0} />, { tilesStore });
  expect(screen.getByRole('dialog')).toBeDefined();
});

test('does not render chip when animations are not in progress', async () => {
  const { tilesStore } = await mockTilesStore();
  tilesStore.isAnimating = false;
  tilesStore.setActiveTile(0, 0);
  tilesStore.chipText = 'foo';
  renderWithMockProvider(<Chip rowIndex={0} columnIndex={0} />, { tilesStore });
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('does not render chip when tiles is not active', async () => {
  const { tilesStore } = await mockTilesStore();
  tilesStore.isAnimating = true;
  tilesStore.setActiveTile(0, 1);
  tilesStore.chipText = 'foo';
  renderWithMockProvider(<Chip rowIndex={0} columnIndex={0} />, { tilesStore });
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('does not render chip when chip text is not set', async () => {
  const { tilesStore } = await mockTilesStore();
  tilesStore.isAnimating = true;
  tilesStore.setActiveTile(0, 0);
  renderWithMockProvider(<Chip rowIndex={0} columnIndex={0} />, { tilesStore });
  expect(screen.queryByRole('dialog')).toBeNull();
});
