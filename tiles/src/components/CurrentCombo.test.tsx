import { act, screen } from '@testing-library/react';
import ComboStore from '../ComboStore';
import { renderWithMockProvider } from '../testHelpers';
import CurrentCombo from './CurrentCombo';

test('renders current combo count', () => {
    const comboStore = new ComboStore([[]]);

    renderWithMockProvider(<CurrentCombo />, { comboStore });
    
    expect(screen.getByText(/current combo: 0/i)).toBeInTheDocument();
    
    act(() => {
        comboStore.incrementCurrentComboCounter();
        comboStore.incrementCurrentComboCounter();
    })
    
    expect(screen.getByText(/current combo: 2/i)).toBeInTheDocument();
});
