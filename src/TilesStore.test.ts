import sinon, { SinonStub } from 'sinon';
import TilesStore from './TilesStore';
import * as api from './api';
import { mockTheme, mockTileSetData } from './testHelpers';
import { TileRowData } from './types/TileRowData';

const emptyTileSet = [[[], []]];

describe('Combo counts', () => {
  let generateTileSetStub: SinonStub;
  let tilesStore: TilesStore;

  beforeEach(async () => {
    generateTileSetStub = sinon.stub(api, 'generateTileSet');
    generateTileSetStub.resolves(emptyTileSet);
    tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('starts with a empty combo counts', () => {
    expect(tilesStore.currentComboCounter).toEqual(0);
    expect(tilesStore.comboCounts).toEqual([]);
  });

  it('can increment currentComboCounter', () => {
    expect(tilesStore.currentComboCounter).toEqual(0);
    tilesStore.incrementCurrentComboCounter();
    expect(tilesStore.currentComboCounter).toEqual(1);
  });

  it('can reset currentComboCounter', () => {
    tilesStore.currentComboCounter = 100;
    expect(tilesStore.currentComboCounter).toEqual(100);
    tilesStore.resetCurrentComboCounter();
    expect(tilesStore.currentComboCounter).toEqual(0);
  });

  it('adds to comboCounts when currentComboCounter is reset', () => {
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
    tilesStore.comboCounts = [1, 2, 3];
    expect(tilesStore.longestComboCount).toEqual(3);
  });

  it('returns the longest combo count including the current count when there are combo counts', () => {
    tilesStore.currentComboCounter = 30;
    tilesStore.comboCounts = [1, 2, 3];
    expect(tilesStore.longestComboCount).toEqual(30);
  });

  it('returns the current combo count when there are no combo counts', () => {
    expect(tilesStore.longestComboCount).toEqual(0);
    tilesStore.incrementCurrentComboCounter();
    expect(tilesStore.longestComboCount).toEqual(1);
  });
});

describe('Selecting tiles', () => {
  let generateTileSetStub: SinonStub;

  beforeEach(async () => {
    generateTileSetStub = sinon.stub(api, 'generateTileSet');
    generateTileSetStub.resolves(emptyTileSet);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('starts with no tiles selected', async () => {
    generateTileSetStub.resolves(emptyTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    expect(tilesStore.selectedTileIndex).toBeUndefined();
  });

  it('can select a tile', async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['b', 'c'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    expect(tilesStore.selectedTileIndex).toBeUndefined();

    tilesStore.setSelectedTileIndex(0, 1);
    expect(tilesStore.selectedTileIndex).toEqual([0, 1]);
  });

  it('can select a match', async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['b', 'c'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    expect(tilesStore.selectedMatchIndex).toBeUndefined();

    tilesStore.setSelectedMatchIndex(0, 1);
    expect(tilesStore.selectedMatchIndex).toEqual([0, 1]);
  });

  it('is a no-op if selected tile is empty', async () => {
    const mockTileSet = mockTileSetData([[['a', 'b'], []]]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);

    // Remains undefined
    expect(tilesStore.selectedTileIndex).toBeUndefined();
    tilesStore.setSelectedTileIndex(0, 1);
    expect(tilesStore.selectedTileIndex).toBeUndefined();

    // Retains previously-selected tile
    tilesStore.setSelectedTileIndex(0, 0);
    tilesStore.setSelectedTileIndex(0, 1);
    expect(tilesStore.selectedTileIndex).toEqual([0, 0]);
  });

  it('is a no-op if selected match is empty', async () => {
    const mockTileSet = mockTileSetData([[['a', 'b'], []]]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);

    // Remains undefined
    expect(tilesStore.selectedMatchIndex).toBeUndefined();
    tilesStore.setSelectedMatchIndex(0, 1);
    expect(tilesStore.selectedMatchIndex).toBeUndefined();

    // Retains previously-selected tile
    tilesStore.setSelectedMatchIndex(0, 0);
    tilesStore.setSelectedMatchIndex(0, 1);
    expect(tilesStore.selectedMatchIndex).toEqual([0, 0]);
  });

  it('can reset the selected tile', async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['b', 'c'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    expect(tilesStore.selectedTileIndex).toBeUndefined();

    tilesStore.setSelectedTileIndex(0, 1);
    expect(tilesStore.selectedTileIndex).toEqual([0, 1]);

    tilesStore.resetSelectedTileIndex();
    expect(tilesStore.selectedTileIndex).toBeUndefined();
  });

  it('can reset the selected match', async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['b', 'c'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    expect(tilesStore.selectedMatchIndex).toBeUndefined();

    tilesStore.setSelectedMatchIndex(0, 1);
    expect(tilesStore.selectedMatchIndex).toEqual([0, 1]);

    tilesStore.resetSelectedMatchIndex();
    expect(tilesStore.selectedMatchIndex).toBeUndefined();
  });

  it('increments current combo count if tiles match', async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['b', 'c'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    tilesStore.setSelectedTileIndex(0, 0);
    tilesStore.matchTiles(0, 1);

    expect(tilesStore.currentComboCounter).toEqual(1);
  });

  it('selected second tile if tiles match and second tile is not empty', async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['b', 'c'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    tilesStore.setSelectedTileIndex(0, 0);
    tilesStore.matchTiles(0, 1);

    expect(tilesStore.selectedTileIndex).toEqual([0, 1]);
  });

  it('resets selected tile if tiles match and second tile is empty', async () => {
    const mockTileSet = mockTileSetData([[['a', 'b'], ['b']]]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    tilesStore.setSelectedTileIndex(0, 0);
    tilesStore.matchTiles(0, 1);

    expect(tilesStore.selectedTileIndex).toBeUndefined();
  });

  it("resets current combo count if tiles don't match", async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['c', 'd'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    tilesStore.currentComboCounter = 100;
    tilesStore.setSelectedTileIndex(0, 0);
    tilesStore.matchTiles(0, 1);

    expect(tilesStore.currentComboCounter).toEqual(0);
    expect(tilesStore.selectedTileIndex).toBeUndefined();
  });

  it('modifies tiles if tiles match -- single match', async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['b', 'c'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    tilesStore.setSelectedTileIndex(0, 0);
    tilesStore.matchTiles(0, 1);

    expect(tilesStore.tileSet).toEqual(mockTileSetData([[['a'], ['c']]]));
  });

  it('modifies tiles if tiles match -- many matches', async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        ['c', 'd', 'e', 'f', 'g', 'h', 'i'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
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

  it('modifies tiles if tiles match -- final match', async () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    tilesStore.setSelectedTileIndex(0, 0);
    tilesStore.matchTiles(0, 1);

    expect(tilesStore.tileSet).toEqual(mockTileSetData([[[], []]]));
  });

  it("does not modify tiles if tiles don't match", async () => {
    const mockTileSet = mockTileSetData([
      [
        ['a', 'b'],
        ['c', 'd'],
      ],
    ]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    tilesStore.currentComboCounter = 100;
    tilesStore.setSelectedTileIndex(0, 0);
    tilesStore.matchTiles(0, 1);

    expect(tilesStore.tileSet).toEqual(mockTileSet);
  });
});

describe('isSelected', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('returns true if tile is selected and false if not', async () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);
    const generateTileSetStub = sinon.stub(api, 'generateTileSet');
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);
    tilesStore.setSelectedTileIndex(0, 1);

    expect(tilesStore.isSelected(0, 1)).toBeTruthy();
    expect(tilesStore.isSelected(0, 0)).toBeFalsy();
  });
});

describe('onTileClick()', () => {
  let generateTileSetStub: SinonStub;

  beforeEach(async () => {
    generateTileSetStub = sinon.stub(api, 'generateTileSet');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('selects tile if none are selected', async () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);

    const matchTileSpy = sinon.spy();
    tilesStore.matchTiles = matchTileSpy;

    expect(tilesStore.selectedTileIndex).toBeUndefined();
    tilesStore.onTileClick(0, 1);
    expect(tilesStore.selectedTileIndex).toEqual([0, 1]);

    expect(matchTileSpy.notCalled).toBeTruthy();
  });

  it('does nothing if clicked tile if already selected', async () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);

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

  it('matches tiles when second tile clicked', async () => {
    const mockTileSet = mockTileSetData([[['a'], ['a']]]);
    generateTileSetStub.resolves(mockTileSet);
    const tilesStore = new TilesStore();
    await Promise.all(generateTileSetStub.returnValues);

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
  afterEach(() => {
    sinon.restore();
  });

  it('reads color from theme', async () => {
    const getThemeStub = sinon.stub(api, 'getTheme');
    getThemeStub.resolves(mockTheme);
    const tilesStore = new TilesStore();

    await Promise.all(getThemeStub.returnValues);

    expect(tilesStore.getAppStyle()).toEqual({
      color: 'white',
      backgroundColor: 'red',
    });
  });

  it('uses default when theme api call fails', async () => {
    const getThemeStub = sinon.stub(api, 'getTheme');
    getThemeStub.resolves(undefined);
    const tilesStore = new TilesStore();

    await Promise.all(getThemeStub.returnValues);

    expect(tilesStore.getAppStyle()).toEqual({
      color: 'black',
      backgroundColor: 'white',
    });
  });
});

describe('getTileStyle', () => {
  let generateTileSetStub: SinonStub;
  let getThemeStub: SinonStub;

  beforeEach(async () => {
    generateTileSetStub = sinon.stub(api, 'generateTileSet');
    getThemeStub = sinon.stub(api, 'getTheme');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('reads color from theme', async () => {
    getThemeStub.resolves(mockTheme);

    const mockTileSet = mockTileSetData([
      [['a'], ['a']],
      [['a'], ['a']],
    ]);
    generateTileSetStub.resolves(mockTileSet);

    const tilesStore = new TilesStore();
    
    await Promise.all(generateTileSetStub.returnValues);
    await Promise.all(getThemeStub.returnValues);

    const result = tilesStore?.tileSet?.map(
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

    getThemeStub.resolves(undefined);
    generateTileSetStub.resolves(mockTileSet);

    const tilesStore = new TilesStore();
    
    await Promise.all(generateTileSetStub.returnValues);
    await Promise.all(getThemeStub.returnValues);

    const result = tilesStore?.tileSet?.map(
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

  it('returns box shadow from theme when tile is selected', async () => {
    getThemeStub.resolves(mockTheme);
    const mockTileSet = mockTileSetData([[['a']]]);
    generateTileSetStub.resolves(mockTileSet);
    
    const tilesStore = new TilesStore();

    await Promise.all(generateTileSetStub.returnValues);
    await Promise.all(getThemeStub.returnValues);

    // Does not return box shadow when tile is not selected
    // this is also implictly asserted in the backgroundColor tests
    let tileStyle = tilesStore.getTileStyle(0, 0);
    expect(Object.keys(tileStyle).includes('boxShadow')).toBeFalsy();

    tilesStore.setSelectedTileIndex(0, 0);

    tileStyle = tilesStore.getTileStyle(0, 0);
    expect(tileStyle.boxShadow).toEqual('inset 0px 0px 0px 5px yellow');
  });

  it('returns default box shadow when tile is selected', async () => {
    getThemeStub.resolves(undefined);

    const mockTileSet = mockTileSetData([[['a']]]);
    generateTileSetStub.resolves(mockTileSet);

    const tilesStore = new TilesStore();

    await Promise.all(generateTileSetStub.returnValues);
    await Promise.all(getThemeStub.returnValues);

    // Does not return box shadow when tile is not selected
    // this is also implictly asserted in the backgroundColor tests
    let tileStyle = tilesStore.getTileStyle(0, 0);
    expect(Object.keys(tileStyle).includes('boxShadow')).toBeFalsy();

    tilesStore.setSelectedTileIndex(0, 0);

    tileStyle = tilesStore.getTileStyle(0, 0);
    expect(tileStyle.boxShadow).toEqual('inset 0px 0px 0px 5px black');
  });
});

describe('this.getTheme', () => {
  let getThemeStub: SinonStub;

  beforeEach(async () => {
    getThemeStub = sinon.stub(api, 'getTheme');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('calls getTheme in constructor', () => {
    new TilesStore();
    expect(getThemeStub.calledOnce).toBeTruthy();
  });

  it('sets theme', async () => {
    getThemeStub.resolves(mockTheme);
    const tilesStore = new TilesStore();
    await Promise.all(getThemeStub.returnValues);
    expect(tilesStore.theme).toEqual(mockTheme);
  });
});
