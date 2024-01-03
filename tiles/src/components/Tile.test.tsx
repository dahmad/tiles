import { render, screen } from '@testing-library/react';
import { RootContextProvider } from '../RootContext';
import Tile from './Tile';

test('renders', () => {
    const mockTile = { contents: [1, 2] };
    const mockTileSet = [[mockTile]];

    render(
        <RootContextProvider tileSetData={mockTileSet}>
            <Tile rowIndex={0} columnIndex={0} />
        </RootContextProvider>
    );
    
    expect(screen.getByText(/1/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
});
