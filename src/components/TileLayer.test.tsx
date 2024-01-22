import { act, screen } from '@testing-library/react';
import sinon from 'sinon';
import { mockTilesStore, renderWithMockProvider } from '../testHelpers';
import TileLayer from './TileLayer';

beforeEach(() => {
  sinon.restore();
});

test('renders an img', async () => {
  const { tilesStore } = await mockTilesStore();
  renderWithMockProvider(
    <TileLayer
      rowIndex={0}
      columnIndex={0}
      component={{ groupName: 'foo', id: 'bar', svg: 'baz' }}
      zIndex={0}
    />,
    { tilesStore }
  );

  expect(screen.getByRole('img')).toBeDefined();
});

test('sets class if layer is disappearing', async () => {
  const { tilesStore } = await mockTilesStore();
  renderWithMockProvider(
    <TileLayer
      rowIndex={0}
      columnIndex={0}
      component={{ groupName: 'foo', id: 'bar', svg: 'baz' }}
      zIndex={0}
    />,
    { tilesStore }
  );

  expect(screen.getByRole('img')).not.toHaveClass('disappearing');

  act(() => {
    tilesStore.setFirstTile(0, 0);
    tilesStore.disappearingLayers = ['bar'];
  });

  expect(screen.getByRole('img')).toHaveClass('disappearing');
});
