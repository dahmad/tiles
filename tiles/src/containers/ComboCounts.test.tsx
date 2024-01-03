import React from 'react';
import { act, render, screen } from '@testing-library/react';
import ComboCounts from './ComboCounts';
import ComboStore from '../ComboStore';

test('renders combo counts', () => {
    const comboStore = new ComboStore([]);
    render(<ComboCounts comboStore={comboStore}/>);
    
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
