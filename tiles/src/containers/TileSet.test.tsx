import { render, screen } from '@testing-library/react';
import { RootContextProvider } from '../RootContext';
import TileSet from './TileSet';

test('renders rows of tiles', () => {
    const firstMockTile = { contents: [1, 2] };
    const secondMockTile = { contents: [3, 4] };
    const mockTileSet = [[firstMockTile], [secondMockTile]];

    render(
        <RootContextProvider tileSetData={mockTileSet}>
            <TileSet />
        </RootContextProvider>
    );
    
    expect(screen.getByText(/1,2/i)).toBeInTheDocument();
    expect(screen.getByText(/3,4/i)).toBeInTheDocument();
});
