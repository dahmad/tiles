import sinon from 'sinon';
import TilesStore from './TilesStore';
import * as api from './api';
import { mockTheme, mockTileSetData } from './testHelpers';
import { TileRowData } from './types/TileRowData';

const emptyTileSet = [[[], []]];

it('starts with a empty combo counts', () => {
  const tilesStore = new TilesStore(emptyTileSet);
  expect(tilesStore.currentComboCounter).toEqual(0);
  expect(tilesStore.comboCounts).toEqual([]);
});

it('can increment currentComboCounter', () => {
  const tilesStore = new TilesStore(emptyTileSet);
  expect(tilesStore.currentComboCounter).toEqual(0);
  tilesStore.incrementCurrentComboCounter();
  expect(tilesStore.currentComboCounter).toEqual(1);
});

it('can reset currentComboCounter', () => {
  const tilesStore = new TilesStore(emptyTileSet);
  tilesStore.currentComboCounter = 100;
  expect(tilesStore.currentComboCounter).toEqual(100);
  tilesStore.resetCurrentComboCounter();
  expect(tilesStore.currentComboCounter).toEqual(0);
});

it('adds to comboCounts when currentComboCounter is reset', () => {
  const tilesStore = new TilesStore(emptyTileSet);

  // Set one combo count
  tilesStore.currentComboCounter = 100;
  expect(tilesStore.currentComboCounter).toEqual(100);

  tilesStore.resetCurrentComboCounter();

  expect(tilesStore.comboCounts).toEqual([100]);

  // Set another combo count
  tilesStore.currentComboCounter = 33;
  expect(tilesStore.currentComboCounter).toEqual(33);

  tilesStore.resetCurrentComboCounter();

  expect(tilesStore.comboCounts).toEqual([100, 33]);
});

it('returns the longest combo count when there are combo counts', () => {
  const tilesStore = new TilesStore(emptyTileSet);
  tilesStore.comboCounts = [1, 2, 3];
  expect(tilesStore.longestComboCount).toEqual(3);
});

it('returns the longest combo count including the current count when there are combo counts', () => {
  const tilesStore = new TilesStore(emptyTileSet);
  tilesStore.currentComboCounter = 30;
  tilesStore.comboCounts = [1, 2, 3];
  expect(tilesStore.longestComboCount).toEqual(30);
});

it('returns the current combo count when there are no combo counts', () => {
  const tilesStore = new TilesStore(emptyTileSet);
  expect(tilesStore.longestComboCount).toEqual(0);
  tilesStore.incrementCurrentComboCounter();
  expect(tilesStore.longestComboCount).toEqual(1);
});

it('starts with no tiles selected', () => {
  const tilesStore = new TilesStore(emptyTileSet);
  expect(tilesStore.selectedTileIndex).toBeUndefined();
});

it('can select a tile', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const tilesStore = new TilesStore(mockTileSet);
  expect(tilesStore.selectedTileIndex).toBeUndefined();

  tilesStore.setSelectedTileIndex(0, 1);
  expect(tilesStore.selectedTileIndex).toEqual([0, 1]);
});

it('is a no-op if selected tile is empty', () => {
  const mockTileSet = mockTileSetData([[['a', 'b'], []]]);

  const tilesStore = new TilesStore(mockTileSet);

  // Remains undefined
  expect(tilesStore.selectedTileIndex).toBeUndefined();
  tilesStore.setSelectedTileIndex(0, 1);
  expect(tilesStore.selectedTileIndex).toBeUndefined();

  // Retains previously-selected tile
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.setSelectedTileIndex(0, 1);
  expect(tilesStore.selectedTileIndex).toEqual([0, 0]);
});

it('can reset the selected tile', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const tilesStore = new TilesStore(mockTileSet);
  expect(tilesStore.selectedTileIndex).toBeUndefined();

  tilesStore.setSelectedTileIndex(0, 1);
  expect(tilesStore.selectedTileIndex).toEqual([0, 1]);

  tilesStore.resetSelectedTileIndex();
  expect(tilesStore.selectedTileIndex).toBeUndefined();
});

it('increments current combo count if tiles match', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const tilesStore = new TilesStore(mockTileSet);
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.matchTiles(0, 1);

  expect(tilesStore.currentComboCounter).toEqual(1);
});

it('selected second tile if tiles match and second tile is not empty', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const tilesStore = new TilesStore(mockTileSet);
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.matchTiles(0, 1);

  expect(tilesStore.selectedTileIndex).toEqual([0, 1]);
});

it('resets selected tile if tiles match and second tile is empty', () => {
  const mockTileSet = mockTileSetData([[['a', 'b'], ['b']]]);

  const tilesStore = new TilesStore(mockTileSet);
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.matchTiles(0, 1);

  expect(tilesStore.selectedTileIndex).toBeUndefined();
});

it("resets current combo count if tiles don't match", () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
  ]);

  const tilesStore = new TilesStore(mockTileSet);
  tilesStore.currentComboCounter = 100;
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.matchTiles(0, 1);

  expect(tilesStore.currentComboCounter).toEqual(0);
  expect(tilesStore.selectedTileIndex).toBeUndefined();
});

it('modifies tiles if tiles match -- single match', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['b', 'c'],
    ],
  ]);

  const tilesStore = new TilesStore(mockTileSet);
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.matchTiles(0, 1);

  expect(tilesStore.tileSet).toEqual(mockTileSetData([[['a'], ['c']]]));
});

it('modifies tiles if tiles match -- many matches', () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      ['c', 'd', 'e', 'f', 'g', 'h', 'i'],
    ],
  ]);
  const tilesStore = new TilesStore(mockTileSet);
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.matchTiles(0, 1);

  expect(tilesStore.tileSet).toEqual(
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

  const tilesStore = new TilesStore(mockTileSet);
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.matchTiles(0, 1);

  expect(tilesStore.tileSet).toEqual(mockTileSetData([[[], []]]));
});

it("does not modify tiles if tiles don't match", () => {
  const mockTileSet = mockTileSetData([
    [
      ['a', 'b'],
      ['c', 'd'],
    ],
  ]);

  const tilesStore = new TilesStore(mockTileSet);
  tilesStore.currentComboCounter = 100;
  tilesStore.setSelectedTileIndex(0, 0);
  tilesStore.matchTiles(0, 1);

  expect(tilesStore.tileSet).toEqual(mockTileSet);
});

describe('isSelected', () => {
  it('returns true if tile is selected and false if not', () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);

    const tilesStore = new TilesStore(mockTileSet);
    tilesStore.setSelectedTileIndex(0, 1);

    expect(tilesStore.isSelected(0, 1)).toBeTruthy();
    expect(tilesStore.isSelected(0, 0)).toBeFalsy();
  });
});

describe('onTileClick()', () => {
  it('selects tile if none are selected', () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);
    const tilesStore = new TilesStore(mockTileSet);

    const matchTileSpy = sinon.spy();
    tilesStore.matchTiles = matchTileSpy;

    expect(tilesStore.selectedTileIndex).toBeUndefined();
    tilesStore.onTileClick(0, 1);
    expect(tilesStore.selectedTileIndex).toEqual([0, 1]);

    expect(matchTileSpy.notCalled).toBeTruthy();
  });

  it('does nothing if clicked tile if already selected', () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);
    const tilesStore = new TilesStore(mockTileSet);

    tilesStore.setSelectedTileIndex(0, 1);

    const setSelectedTileIndexSpy = sinon.spy();
    tilesStore.setSelectedTileIndex = setSelectedTileIndexSpy;
    const matchTileSpy = sinon.spy();
    tilesStore.matchTiles = matchTileSpy;

    tilesStore.onTileClick(0, 1);
    expect(tilesStore.selectedTileIndex).toEqual([0, 1]);

    expect(setSelectedTileIndexSpy.notCalled).toBeTruthy();
    expect(matchTileSpy.notCalled).toBeTruthy();
  });

  it('matches tiles when second tile clicked', () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);
    const tilesStore = new TilesStore(mockTileSet);

    tilesStore.setSelectedTileIndex(0, 1);

    const setSelectedTileIndexSpy = sinon.spy();
    tilesStore.setSelectedTileIndex = setSelectedTileIndexSpy;
    const matchTileSpy = sinon.spy();
    tilesStore.matchTiles = matchTileSpy;

    tilesStore.onTileClick(0, 0);

    expect(setSelectedTileIndexSpy.notCalled).toBeTruthy();
    expect(matchTileSpy.calledOnce).toBeTruthy();
  });
});

describe('getAppStyle', () => {
  beforeEach(() => {
    sinon.restore();
  });

  it('reads color from theme', async () => {
    const getThemeStub = sinon.stub(api, 'getTheme');
    getThemeStub.resolves(mockTheme);
    const tilesStore = new TilesStore(emptyTileSet);

    await Promise.all(getThemeStub.returnValues);

    expect(tilesStore.getAppStyle()).toEqual({
      color: 'white',
      backgroundColor: 'red',
    });
  });

  it('uses default when theme api call fails', async () => {
    const getThemeStub = sinon.stub(api, 'getTheme');
    getThemeStub.resolves(undefined);
    const tilesStore = new TilesStore(emptyTileSet);

    await Promise.all(getThemeStub.returnValues);

    expect(tilesStore.getAppStyle()).toEqual({
      color: 'black',
      backgroundColor: 'white',
    });
  });
});

describe('getTileStyle', () => {
  beforeEach(() => {
    sinon.restore();
  });

  it('reads color from theme', async () => {
    const mockTileSet = mockTileSetData([
      [['a'], ['a']],
      [['a'], ['a']],
    ]);
    const getThemeStub = sinon.stub(api, 'getTheme');
    getThemeStub.resolves(mockTheme);
    const tilesStore = new TilesStore(mockTileSet);

    await Promise.all(getThemeStub.returnValues);

    const result = tilesStore.tileSet.map(
      (tileRow: TileRowData, rowNumber: number) => {
        return tileRow.map((_, columnNumber: number) => {
          return tilesStore.getTileStyle(rowNumber, columnNumber);
        });
      }
    );

    expect(result).toEqual([
      [{ backgroundColor: 'blue' }, { backgroundColor: 'black' }],
      [{ backgroundColor: 'black' }, { backgroundColor: 'blue' }],
    ]);
  });

  it('uses default when theme api call fails', async () => {
    const mockTileSet = mockTileSetData([
      [['a'], ['a']],
      [['a'], ['a']],
    ]);
    const getThemeStub = sinon.stub(api, 'getTheme');
    getThemeStub.resolves(undefined);
    const tilesStore = new TilesStore(mockTileSet);

    await Promise.all(getThemeStub.returnValues);

    const result = tilesStore.tileSet.map(
      (tileRow: TileRowData, rowNumber: number) => {
        return tileRow.map((_, columnNumber: number) => {
          return tilesStore.getTileStyle(rowNumber, columnNumber);
        });
      }
    );

    expect(result).toEqual([
      [{ backgroundColor: 'white' }, { backgroundColor: '#dddddd' }],
      [{ backgroundColor: '#dddddd' }, { backgroundColor: 'white' }],
    ]);
  });
});

describe('this.getTheme', () => {
  beforeEach(() => {
    sinon.restore();
  });

  it('calls getTheme in constructor', () => {
    const geThemeStub = sinon.stub(api, 'getTheme');
    new TilesStore(emptyTileSet);
    expect(geThemeStub.calledOnce).toBeTruthy();
  });

  it('sets theme', () => {
    const geThemeStub = sinon.stub(api, 'getTheme');
    geThemeStub.returns(
      new Promise(() => {
        return mockTheme;
      })
    );
    new TilesStore(emptyTileSet);
    expect(geThemeStub.calledOnce).toBeTruthy();
  });
});
