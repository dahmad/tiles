import { act, render, screen } from '@testing-library/react';
import ComboStore from '../ComboStore';
import CurrentCombo from './CurrentCombo';

test('renders current combo count', () => {
    const comboStore = new ComboStore([]);
    render(<CurrentCombo comboStore={comboStore}/>);
    
    expect(screen.getByText(/current combo: 0/i)).toBeInTheDocument();
    
    act(() => {
        comboStore.incrementCurrentComboCounter();
        comboStore.incrementCurrentComboCounter();
    })
    
    expect(screen.getByText(/current combo: 2/i)).toBeInTheDocument();
});
