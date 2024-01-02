import React from 'react';
import { act, render, screen } from '@testing-library/react';
import LongestCombo from './LongestCombo';
import ComboStore from '../ComboStore';

test('renders longest combo count', () => {
    const comboStore = new ComboStore([]);
    render(<LongestCombo comboStore={comboStore}/>);
    
    // Longest combo count follows current count at start
    expect(screen.getByText(/longest combo: 0/i)).toBeInTheDocument();
    
    act(() => {
        comboStore.incrementCurrentComboCounter();
        comboStore.incrementCurrentComboCounter();
    })
    
    expect(screen.getByText(/longest combo: 2/i)).toBeInTheDocument();

    // Longest combo count is retained after current combo count is reset
    act(() => {
        comboStore.resetCurrentComboCounter();
    })

    expect(screen.getByText(/longest combo: 2/i)).toBeInTheDocument();

    // Longest combo count is retained while current count is less than longest
    act(() => {
        comboStore.incrementCurrentComboCounter();
    })

    expect(screen.getByText(/longest combo: 2/i)).toBeInTheDocument();

    // Longest combo count is updated when current count surpasses previous longest
    act(() => {
        comboStore.incrementCurrentComboCounter();
        comboStore.incrementCurrentComboCounter();
    })

    expect(screen.getByText(/longest combo: 3/i)).toBeInTheDocument();
});
