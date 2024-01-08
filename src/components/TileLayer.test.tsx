import { render, screen } from '@testing-library/react';
import React from 'react';
import TileLayer from './TileLayer';

test('renders an img', () => {
  render(
    <TileLayer
      component={{ groupName: 'foo', id: 'bar', svg: 'baz' }}
      zIndex={0}
    />
  );

  expect(screen.getByRole('img')).toBeDefined();
});
