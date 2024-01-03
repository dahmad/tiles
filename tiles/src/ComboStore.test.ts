import ComboStore from './ComboStore';

const emptyTileSet = [[]]

it('starts with a empty combo counts', () => {
    const comboStore = new ComboStore(emptyTileSet);
    expect(comboStore.currentComboCounter).toEqual(0);
    expect(comboStore.comboCounts).toEqual([]);
})

it('can increment currentComboCounter', () => {
    const comboStore = new ComboStore(emptyTileSet);
    expect(comboStore.currentComboCounter).toEqual(0);
    comboStore.incrementCurrentComboCounter();
    expect(comboStore.currentComboCounter).toEqual(1);
})

it('can reset currentComboCounter', () => {
    const comboStore = new ComboStore(emptyTileSet);
    comboStore.currentComboCounter = 100;
    expect(comboStore.currentComboCounter).toEqual(100);
    comboStore.resetCurrentComboCounter();
    expect(comboStore.currentComboCounter).toEqual(0);
})

it('adds to comboCounts when currentComboCounter is reset', () => {
    const comboStore = new ComboStore(emptyTileSet);

    // Set one combo count
    comboStore.currentComboCounter = 100;
    expect(comboStore.currentComboCounter).toEqual(100);

    comboStore.resetCurrentComboCounter();

    expect(comboStore.comboCounts).toEqual([100]);

    // Set another combo count
    comboStore.currentComboCounter = 33;
    expect(comboStore.currentComboCounter).toEqual(33);

    comboStore.resetCurrentComboCounter();

    expect(comboStore.comboCounts).toEqual([100, 33]);
})

it('returns the longest combo count when there are combo counts', () => {
    const comboStore = new ComboStore(emptyTileSet);
    comboStore.comboCounts = [1,2,3];
    expect(comboStore.longestComboCount).toEqual(3);
})

it('returns the longest combo count including the current count when there are combo counts', () => {
    const comboStore = new ComboStore(emptyTileSet);
    comboStore.currentComboCounter = 30;
    comboStore.comboCounts = [1,2,3];
    expect(comboStore.longestComboCount).toEqual(30);
})

it('returns the current combo count when there are no combo counts', () => {
    const comboStore = new ComboStore(emptyTileSet);
    expect(comboStore.longestComboCount).toEqual(0);
    comboStore.incrementCurrentComboCounter();
    expect(comboStore.longestComboCount).toEqual(1);
})

it('starts with no tiles selected', () => {
    const comboStore = new ComboStore(emptyTileSet);
    expect(comboStore.selectedTileIndex).toBeUndefined();
})

it('can select a tile', () => {
    const comboStore = new ComboStore(emptyTileSet);
    expect(comboStore.selectedTileIndex).toBeUndefined();

    comboStore.setSelectedTileIndex(0, 1);
    expect(comboStore.selectedTileIndex).toEqual([0, 1]);

    comboStore.setSelectedTileIndex(2, 3);
    expect(comboStore.selectedTileIndex).toEqual([2, 3]);
})

it('can reset the selected tile', () => {
    const comboStore = new ComboStore(emptyTileSet);
    expect(comboStore.selectedTileIndex).toBeUndefined();

    comboStore.setSelectedTileIndex(0, 1);
    expect(comboStore.selectedTileIndex).toEqual([0, 1]);

    comboStore.resetSelectedTileIndex();
    expect(comboStore.selectedTileIndex).toBeUndefined();
})

it('increments current combo count if tiles match', () => {
    const firstTile = { contents: [1,2,4] }
    const secondTile = { contents: [4,5,6] }

    const comboStore = new ComboStore([[firstTile, secondTile]]);
    comboStore.setSelectedTileIndex(0, 0);
    comboStore.matchTiles(0, 1);

    expect(comboStore.currentComboCounter).toEqual(1);
    expect(comboStore.selectedTileIndex).toBeUndefined();
})

it('resets current combo count if tiles don\'t match', () => {
    const firstTile = { contents: [1,2,3] }
    const secondTile = { contents: [4,5,6] }

    const comboStore = new ComboStore([[firstTile, secondTile]]);
    comboStore.currentComboCounter = 100;
    comboStore.setSelectedTileIndex(0, 0);
    comboStore.matchTiles(0, 1);

    expect(comboStore.currentComboCounter).toEqual(0);
    expect(comboStore.selectedTileIndex).toBeUndefined();
})

it('modifies tiles if tiles match -- single match', () => {
    const firstTile = { contents: [1,2,4] }
    const secondTile = { contents: [4,5,6] }

    const comboStore = new ComboStore([[firstTile, secondTile]]);
    comboStore.setSelectedTileIndex(0, 0);
    comboStore.matchTiles(0, 1);

    expect(comboStore.tileSet[0][0]).toEqual({ contents: [1,2] });
    expect(comboStore.tileSet[0][1]).toEqual({ contents: [5,6] });
})

it('modifies tiles if tiles match -- many matches', () => {
    const firstTile = { contents: [1,2,3,4,5,6,7,8] }
    const secondTile = { contents: [4,5,6,7,8,9] }

    const comboStore = new ComboStore([[firstTile, secondTile]]);
    comboStore.setSelectedTileIndex(0, 0);
    comboStore.matchTiles(0, 1);

    expect(comboStore.tileSet[0][0]).toEqual({ contents: [1,2,3] });
    expect(comboStore.tileSet[0][1]).toEqual({ contents: [9] });
})

it('modifies tiles if tiles match -- final match', () => {
    const firstTile = { contents: [1] }
    const secondTile = { contents: [1] }

    const comboStore = new ComboStore([[firstTile, secondTile]]);
    comboStore.setSelectedTileIndex(0, 0);
    comboStore.matchTiles(0, 1);

    expect(comboStore.tileSet[0][0]).toEqual({ contents: [] });
    expect(comboStore.tileSet[0][1]).toEqual({ contents: [] });
})

it('does not modify tiles if tiles don\'t match', () => {
    const firstTile = { contents: [1,2,3] }
    const secondTile = { contents: [4,5,6] }

    const comboStore = new ComboStore([[firstTile, secondTile]]);
    comboStore.currentComboCounter = 100;
    comboStore.setSelectedTileIndex(0, 0);
    comboStore.matchTiles(0, 1);

    expect(comboStore.tileSet[0][0]).toEqual(firstTile);
    expect(comboStore.tileSet[0][1]).toEqual(secondTile);
})
