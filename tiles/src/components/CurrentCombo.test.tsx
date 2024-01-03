import React from 'react';
import { act, render, screen } from '@testing-library/react';
import CurrentCombo from './CurrentCombo';
import ComboStore from '../ComboStore';

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
