import { act, screen } from '@testing-library/react';
import ComboStore from '../ComboStore';
import { renderWithMockProvider } from '../testHelpers';
import ComboCounts from './ComboCounts';

test('renders combo counts', () => {
    const comboStore = new ComboStore([[]]);

    renderWithMockProvider(<ComboCounts />, { comboStore });
    
    expect(screen.getByText(/current combo: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/longest combo: 0/i)).toBeInTheDocument();
    
    act(() => {
        comboStore.incrementCurrentComboCounter();
    })
    
    expect(screen.getByText(/current combo: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/longest combo: 1/i)).toBeInTheDocument();

    act(() => {
        comboStore.resetCurrentComboCounter();
    })

    expect(screen.getByText(/current combo: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/longest combo: 1/i)).toBeInTheDocument();

    act(() => {
        comboStore.incrementCurrentComboCounter();
    })

    expect(screen.getByText(/current combo: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/longest combo: 1/i)).toBeInTheDocument();

    act(() => {
        comboStore.incrementCurrentComboCounter();
    })

    expect(screen.getByText(/current combo: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/longest combo: 2/i)).toBeInTheDocument();
});
