import { render, screen } from '@testing-library/react';
import { RootContextProvider } from '../RootContext';
import TileRow from './TileRow';

test('renders row of tiles', () => {
    const firstMockTile = { contents: [1, 2] };
    const secondMockTile = { contents: [3, 4] };
    const mockTileSet = [[firstMockTile, secondMockTile]];

    render(
        <RootContextProvider tileSetData={mockTileSet}>
            <TileRow rowIndex={0} />
        </RootContextProvider>
    );
    
    expect(screen.getByText(/1,2/i)).toBeInTheDocument();
    expect(screen.getByText(/3,4/i)).toBeInTheDocument();
});

test('does not render other rows of tiles', () => {
    const firstMockTile = { contents: [1, 2] };
    const secondMockTile = { contents: [3, 4] };
    const mockTileSet = [[firstMockTile], [secondMockTile]];

    render(
        <RootContextProvider tileSetData={mockTileSet}>
            <TileRow rowIndex={0} />
        </RootContextProvider>
    );
    
    expect(screen.getByText(/1,2/i)).toBeInTheDocument();
    expect(screen.queryByText(/3,4/i)).not.toBeInTheDocument();
});
