import ComboStore from './ComboStore';
import { mockTileSetData } from './testHelpers';

const emptyTileSet = [[[], []]];

it('starts with a empty combo counts', () => {
  const comboStore = new ComboStore(emptyTileSet);
  expect(comboStore.currentComboCounter).toEqual(0);
  expect(comboStore.comboCounts).toEqual([]);
});

it('can increment currentComboCounter', () => {
  const comboStore = new ComboStore(emptyTileSet);
  expect(comboStore.currentComboCounter).toEqual(0);
  comboStore.incrementCurrentComboCounter();
  expect(comboStore.currentComboCounter).toEqual(1);
});

it('can reset currentComboCounter', () => {
  const comboStore = new ComboStore(emptyTileSet);
  comboStore.currentComboCounter = 100;
  expect(comboStore.currentComboCounter).toEqual(100);
  comboStore.resetCurrentComboCounter();
  expect(comboStore.currentComboCounter).toEqual(0);
});

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
});

it('returns the longest combo count when there are combo counts', () => {
  const comboStore = new ComboStore(emptyTileSet);
  comboStore.comboCounts = [1, 2, 3];
  expect(comboStore.longestComboCount).toEqual(3);
});

it('returns the longest combo count including the current count when there are combo counts', () => {
  const comboStore = new ComboStore(emptyTileSet);
  comboStore.currentComboCounter = 30;
  comboStore.comboCounts = [1, 2, 3];
  expect(comboStore.longestComboCount).toEqual(30);
});

it('returns the current combo count when there are no combo counts', () => {
  const comboStore = new ComboStore(emptyTileSet);
  expect(comboStore.longestComboCount).toEqual(0);
  comboStore.incrementCurrentComboCounter();
  expect(comboStore.longestComboCount).toEqual(1);
});

it('starts with no tiles selected', () => {
  const comboStore = new ComboStore(emptyTileSet);
  expect(comboStore.selectedTileIndex).toBeUndefined();
});

it('can select a tile', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const comboStore = new ComboStore(mockTileSet);
  expect(comboStore.selectedTileIndex).toBeUndefined();

  comboStore.setSelectedTileIndex(0, 1);
  expect(comboStore.selectedTileIndex).toEqual([0, 1]);
});

it('is a no-op if selected tile is empty', () => {
  const mockTileSet = mockTileSetData([[['a', 'b'], []]]);

  const comboStore = new ComboStore(mockTileSet);

  // Remains undefined
  expect(comboStore.selectedTileIndex).toBeUndefined();
  comboStore.setSelectedTileIndex(0, 1);
  expect(comboStore.selectedTileIndex).toBeUndefined();

  // Retains previously-selected tile
  comboStore.setSelectedTileIndex(0, 0);
  comboStore.setSelectedTileIndex(0, 1);
  expect(comboStore.selectedTileIndex).toEqual([0, 0]);
});

it('can reset the selected tile', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const comboStore = new ComboStore(mockTileSet);
  expect(comboStore.selectedTileIndex).toBeUndefined();

  comboStore.setSelectedTileIndex(0, 1);
  expect(comboStore.selectedTileIndex).toEqual([0, 1]);

  comboStore.resetSelectedTileIndex();
  expect(comboStore.selectedTileIndex).toBeUndefined();
});

it('increments current combo count if tiles match', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const comboStore = new ComboStore(mockTileSet);
  comboStore.setSelectedTileIndex(0, 0);
  comboStore.matchTiles(0, 1);

  expect(comboStore.currentComboCounter).toEqual(1);
  expect(comboStore.selectedTileIndex).toBeUndefined();
});

it("resets current combo count if tiles don't match", () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
  ]);

  const comboStore = new ComboStore(mockTileSet);
  comboStore.currentComboCounter = 100;
  comboStore.setSelectedTileIndex(0, 0);
  comboStore.matchTiles(0, 1);

  expect(comboStore.currentComboCounter).toEqual(0);
  expect(comboStore.selectedTileIndex).toBeUndefined();
});

it('modifies tiles if tiles match -- single match', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const comboStore = new ComboStore(mockTileSet);
  comboStore.setSelectedTileIndex(0, 0);
  comboStore.matchTiles(0, 1);

  expect(comboStore.tileSet).toEqual(mockTileSetData([[['a'], ['c']]]));
});

it('modifies tiles if tiles match -- many matches', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      ['c', 'd', 'e', 'f', 'g', 'h', 'i'],
    ],
  ]);
  const comboStore = new ComboStore(mockTileSet);
  comboStore.setSelectedTileIndex(0, 0);
  comboStore.matchTiles(0, 1);

  expect(comboStore.tileSet).toEqual(
    mockTileSetData([
      [
        ['a', 'b'],
        ['h', 'i'],
      ],
    ])
  );
});

it('modifies tiles if tiles match -- final match', () => {
  const mockTileSet = mockTileSetData([[['a'], ['a']]]);

  const comboStore = new ComboStore(mockTileSet);
  comboStore.setSelectedTileIndex(0, 0);
  comboStore.matchTiles(0, 1);

  expect(comboStore.tileSet).toEqual(mockTileSetData([[[], []]]));
});

it("does not modify tiles if tiles don't match", () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
  ]);

  const comboStore = new ComboStore(mockTileSet);
  comboStore.currentComboCounter = 100;
  comboStore.setSelectedTileIndex(0, 0);
  comboStore.matchTiles(0, 1);

  expect(comboStore.tileSet).toEqual(mockTileSet);
});
