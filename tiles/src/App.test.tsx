import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { RootContextProvider } from './RootContext';

test('renders', () => {
  render(
    <RootContextProvider>
      <App />
    </RootContextProvider>
  )
  expect(screen.getByText(/current combo/i)).toBeInTheDocument();
  expect(screen.getByText(/longest combo/i)).toBeInTheDocument();
});
