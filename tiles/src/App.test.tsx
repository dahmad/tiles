import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import ComboStore from './ComboStore';

test('renders', () => {
  render(<App comboStore={new ComboStore([])}/>);
  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
});
