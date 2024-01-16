import sinon, { SinonStub } from 'sinon';
import TilesStore from './TilesStore';
import * as api from './api';
import { mockTheme, mockTileSetData, mockTilesStore } from './testHelpers';
import { TileRowData } from './types/TileRowData';

const emptyTileSet = [[[], []]];

describe('TilesStore', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('sets theme in constructor', async () => {
      const getThemeStub = sinon.stub(api, 'getTheme');
      getThemeStub.resolves(mockTheme);

      const tilesStore = new TilesStore();

      await Promise.all(getThemeStub.returnValues);

      expect(getThemeStub.calledOnce).toBeTruthy();
      expect(tilesStore.theme).toEqual(mockTheme);
    });

    it('generates and sets tile set in constructor', async () => {
      const generateTileSetStub = sinon.stub(api, 'generateTileSet');
      generateTileSetStub.resolves(emptyTileSet);

      const tilesStore = new TilesStore();

      await Promise.all(generateTileSetStub.returnValues);

      expect(generateTileSetStub.calledOnce).toBeTruthy();
      expect(tilesStore.tileSet).toEqual(emptyTileSet);
    });
  });

  describe('actions', () => {
    describe('filterIntersectingLayers', () => {
      const tileSet = mockTileSetData([
        [
          ['a', 'b'],
          ['b', 'c'],
        ],
        [
          ['c', 'd'],
          ['d', 'e'],
        ],
      ]);

      it('updates tile in place', async () => {
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.intersectingLayerIds = ['a'];
        tilesStore.filterIntersectingLayers([0, 0]);
        expect(tilesStore?.tileSet?.[0][0]).toEqual([
          {
            groupName: '',
            id: 'b',
            svg: '',
          },
        ]);
      });

      it('is a no-op if interectingLayerIds is empty', async () => {
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.intersectingLayerIds = [];
        tilesStore.filterIntersectingLayers([0, 0]);
        expect(tilesStore?.tileSet?.[0][0]).toEqual(
          tilesStore?.tileSet?.[0][0]
        );
      });

      it('is a no-op if no matching layers are found', async () => {
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.intersectingLayerIds = ['d'];
        tilesStore.filterIntersectingLayers([0, 0]);
        expect(tilesStore?.tileSet?.[0][0]).toEqual(
          tilesStore?.tileSet?.[0][0]
        );
      });
    });

    describe('getTheme', () => {
      it('calls API', async () => {
        const { getThemeStub } = await mockTilesStore();
        expect(getThemeStub.calledOnce).toBeTruthy();
      });
    });

    describe('generateTileSet', () => {
      it('calls API', async () => {
        const { generateTileSetStub } = await mockTilesStore();
        expect(generateTileSetStub.calledOnce).toBeTruthy();
      });
    });

    describe('incrementCurrentComboCounter', () => {
      it('can increment currentComboCounter', async () => {
        const { tilesStore } = await mockTilesStore();
        expect(tilesStore.currentComboCounter).toEqual(0);
        tilesStore.incrementCurrentComboCounter();
        expect(tilesStore.currentComboCounter).toEqual(1);
      });
    });

    describe('matchTiles', () => {
      let tilesStore: TilesStore;
      let setIntersectingLayerIdsStub: sinon.SinonStub;
      let onMatchSuccessStub: sinon.SinonStub;
      let onMatchFailureStub: sinon.SinonStub;

      beforeEach(async () => {
        ({ tilesStore } = await mockTilesStore());
        setIntersectingLayerIdsStub = sinon.stub();
        tilesStore.setIntersectingLayerIds = setIntersectingLayerIdsStub;
        onMatchSuccessStub = sinon.stub();
        tilesStore.onMatchSuccess = onMatchSuccessStub;
        onMatchFailureStub = sinon.stub();
        tilesStore.onMatchFailure = onMatchFailureStub;
      });

      it('sets intersection layer IDs', async () => {
        tilesStore.matchTiles();
        expect(setIntersectingLayerIdsStub.calledOnce).toBeTruthy();
      });

      it('calls onMatchSuccess if there are matches', async () => {
        tilesStore.intersectingLayerIds = ['a'];
        tilesStore.matchTiles();
        expect(onMatchSuccessStub.calledOnce).toBeTruthy();
        expect(onMatchFailureStub.notCalled).toBeTruthy();
      });

      it('calls onMatchFailure if there are no matches', async () => {
        tilesStore.intersectingLayerIds = [];
        tilesStore.matchTiles();
        expect(onMatchFailureStub.calledOnce).toBeTruthy();
        expect(onMatchSuccessStub.notCalled).toBeTruthy();
      });
    });

    describe('onMatchFailure', () => {
      let clock: sinon.SinonFakeTimers;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('sets and then unsets chip text', async () => {
        const { tilesStore } = await mockTilesStore();
        const setChipTextStub = sinon.stub();
        tilesStore.setChipText = setChipTextStub;
        const resetChipTextStub = sinon.stub();
        tilesStore.resetChipText = resetChipTextStub;

        tilesStore.onMatchFailure();

        expect(setChipTextStub.calledOnce).toBeTruthy();
        expect(resetChipTextStub.notCalled).toBeTruthy();

        clock.tick(tilesStore.timeout + 1);

        expect(setChipTextStub.calledOnce).toBeTruthy();
        expect(resetChipTextStub.calledOnce).toBeTruthy();
      });

      it('resets current combo counter', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.currentComboCounter = 100;
        tilesStore.onMatchFailure();
        expect(tilesStore.currentComboCounter).toEqual(0);
      });

      it('sets and then unsets isAnimating flag', async () => {
        const { tilesStore } = await mockTilesStore();
        expect(tilesStore.isAnimating).toBeFalsy();
        tilesStore.onMatchFailure();
        expect(tilesStore.isAnimating).toBeTruthy();
        clock.tick(tilesStore.timeout + 1);
        expect(tilesStore.isAnimating).toBeFalsy();
      });

      it('eventually resets active tile', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.activeTile = [1, 2];
        tilesStore.onMatchFailure();
        expect(tilesStore.activeTile).toEqual([1, 2]);
        clock.tick(tilesStore.timeout + 1);
        expect(tilesStore.activeTile).toBeUndefined();
      });

      it('eventually resets first tile', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.firstTile = [1, 2];
        tilesStore.onMatchFailure();
        expect(tilesStore.firstTile).toEqual([1, 2]);
        clock.tick(tilesStore.timeout + 1);
        expect(tilesStore.firstTile).toBeUndefined();
      });
    });

    describe('onMatchSuccess', () => {
      let clock: sinon.SinonFakeTimers;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('sets and then unset isAnimating', async () => {
        const { tilesStore } = await mockTilesStore();
        expect(tilesStore.isAnimating).toBeFalsy();
        tilesStore.onMatchSuccess();
        expect(tilesStore.isAnimating).toBeTruthy();
        clock.tick(tilesStore.timeout + 1);
        await Promise.all([tilesStore.setFilteredTiles]);
        expect(tilesStore.isAnimating).toBeFalsy();
      });

      it('increments current combo count', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.currentComboCounter = 100;
        tilesStore.onMatchSuccess();
        expect(tilesStore.currentComboCounter).toEqual(101);
      });

      it('sets and then unsets chip text', async () => {
        const { tilesStore } = await mockTilesStore();
        const setChipTextStub = sinon.stub();
        tilesStore.setChipText = setChipTextStub;
        const resetChipTextStub = sinon.stub();
        tilesStore.resetChipText = resetChipTextStub;

        tilesStore.onMatchSuccess();

        expect(setChipTextStub.calledOnce).toBeTruthy();
        expect(resetChipTextStub.notCalled).toBeTruthy();

        clock.tick(tilesStore.timeout + 1);
        await Promise.all([tilesStore.setFilteredTiles]);

        expect(setChipTextStub.calledOnce).toBeTruthy();
        expect(resetChipTextStub.calledOnce).toBeTruthy();
      });

      it('sets and then resets disappearing layers', async () => {
        const { tilesStore } = await mockTilesStore();
        const setDisappearingLayersStub = sinon.stub();
        tilesStore.setDisappearingLayers = setDisappearingLayersStub;
        const resetDisappearingLayersStub = sinon.stub();
        tilesStore.resetDisappearingLayers = resetDisappearingLayersStub;

        tilesStore.onMatchSuccess();

        expect(setDisappearingLayersStub.calledOnce).toBeTruthy();
        expect(resetDisappearingLayersStub.notCalled).toBeTruthy();

        clock.tick(tilesStore.timeout + 1);
        await Promise.all([tilesStore.setFilteredTiles]);

        expect(setDisappearingLayersStub.calledOnce).toBeTruthy();
        expect(resetDisappearingLayersStub.calledOnce).toBeTruthy();
      });

      it('sets filtered tiles', async () => {
        const { tilesStore } = await mockTilesStore();
        const setFilteredTilesStub = sinon.stub().resolves();
        tilesStore.setFilteredTiles = setFilteredTilesStub;
        tilesStore.onMatchSuccess();
        expect(setFilteredTilesStub.calledOnce).toBeTruthy();
      });

      it('eventually resets first tile is tile is empty', async () => {
        const { tilesStore } = await mockTilesStore([[[]]]);
        const resetFirstTileStub = sinon.stub();
        tilesStore.resetFirstTile = resetFirstTileStub;
        const shiftSelectedTilesStub = sinon.stub();
        tilesStore.shiftSelectedTiles = shiftSelectedTilesStub;

        tilesStore.secondTile = [0, 0];
        tilesStore.onMatchSuccess();
        clock.tick(tilesStore.timeout + 1);
        await Promise.all([tilesStore.setFilteredTiles]);

        expect(resetFirstTileStub.calledOnce).toBeTruthy();
        expect(shiftSelectedTilesStub.notCalled).toBeTruthy();
      });

      it('eventually sets second tile to active if tile is not empty', async () => {
        const tileSet = mockTileSetData([[['a']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        const resetFirstTileStub = sinon.stub();
        tilesStore.resetFirstTile = resetFirstTileStub;
        const shiftSelectedTilesStub = sinon.stub();
        tilesStore.shiftSelectedTiles = shiftSelectedTilesStub;

        tilesStore.secondTile = [0, 0];
        tilesStore.onMatchSuccess();
        clock.tick(tilesStore.timeout + 1);
        await Promise.all([tilesStore.setFilteredTiles]);

        expect(shiftSelectedTilesStub.calledOnce).toBeTruthy();
        expect(resetFirstTileStub.notCalled).toBeTruthy();
      });
    });

    describe('shiftSelectedTiles', () => {
      it('sets first tile to second tile and resets second tile', async () => {
        const tileSet = mockTileSetData([[['a']], [['b']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.firstTile = [0, 0];
        tilesStore.secondTile = [1, 0];
        tilesStore.shiftSelectedTiles();
        expect(tilesStore.firstTile).toEqual([1, 0]);
        expect(tilesStore.secondTile).toBeUndefined();
      });
    });

    describe('onTileClick', () => {
      let tilesStore: TilesStore;
      let setFirstTileStub: sinon.SinonStub;
      let setActiveTileStub: sinon.SinonStub;
      let setSecondTileStub: sinon.SinonStub;
      let matchTilesStub: sinon.SinonStub;

      beforeEach(async () => {
        ({ tilesStore } = await mockTilesStore());
        setFirstTileStub = sinon.stub();
        tilesStore.setFirstTile = setFirstTileStub;
        setActiveTileStub = sinon.stub();
        tilesStore.setActiveTile = setActiveTileStub;
        setSecondTileStub = sinon.stub();
        tilesStore.setSecondTile = setSecondTileStub;
        matchTilesStub = sinon.stub();
        tilesStore.matchTiles = matchTilesStub;
      });

      it('is a no-op if animations are in progress', async () => {
        tilesStore.isAnimating = true;
        tilesStore.onTileClick(0, 0);
        expect(setFirstTileStub.notCalled).toBeTruthy();
        expect(setActiveTileStub.notCalled).toBeTruthy();
        expect(setSecondTileStub.notCalled).toBeTruthy();
        expect(matchTilesStub.notCalled).toBeTruthy();
      });

      it('sets first tile and active tile to selection if first tile is unset', async () => {
        tilesStore.onTileClick(0, 0);
        expect(setFirstTileStub.calledOnce).toBeTruthy();
        expect(setActiveTileStub.calledOnce).toBeTruthy();
        expect(setSecondTileStub.notCalled).toBeTruthy();
        expect(matchTilesStub.notCalled).toBeTruthy();
      });

      it('is a no-op if selection matches first tile', async () => {
        tilesStore.firstTile = [0, 0];
        tilesStore.onTileClick(0, 0);
        expect(setFirstTileStub.notCalled).toBeTruthy();
        expect(setActiveTileStub.notCalled).toBeTruthy();
        expect(setSecondTileStub.notCalled).toBeTruthy();
        expect(matchTilesStub.notCalled).toBeTruthy();
      });

      it('sets second tile, sets active tile, and matches tiles when second tile is selected', async () => {
        tilesStore.firstTile = [0, 0];
        tilesStore.onTileClick(0, 1);
        expect(setFirstTileStub.notCalled).toBeTruthy();
        expect(setActiveTileStub.calledOnce).toBeTruthy();
        expect(setSecondTileStub.calledOnce).toBeTruthy();
        expect(matchTilesStub.calledOnce).toBeTruthy();
      });
    });

    describe('pushDisappearingLayers', () => {
      it('appends matching layer IDs', async () => {
        const tileSet = mockTileSetData([[['a', 'b']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.disappearingLayers = ['c'];
        tilesStore.intersectingLayerIds = ['a'];
        tilesStore.pushDisappearingLayers([0, 0]);
        expect(tilesStore.disappearingLayers).toEqual(['c', 'a']);
      });

      it('is a no-op if no layers match', async () => {
        const tileSet = mockTileSetData([[['a', 'b']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.disappearingLayers = ['c'];
        tilesStore.intersectingLayerIds = ['d'];
        tilesStore.pushDisappearingLayers([0, 0]);
        expect(tilesStore.disappearingLayers).toEqual(['c']);
      });
    });

    describe('resetActiveTile', () => {
      it('marks active tile as undefined', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.activeTile = [0, 0];
        tilesStore.resetActiveTile();
        expect(tilesStore.activeTile).toBeUndefined();
      });
    });

    describe('resetChipText', () => {
      it('marks chip text as undefined', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.chipText = 'foo';
        tilesStore.resetChipText();
        expect(tilesStore.activeTile).toBeUndefined();
      });
    });

    describe('resetCurrentComboCounter', () => {
      it('adds current combo count to array of combo counts', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.comboCounts = [1, 2];
        tilesStore.currentComboCounter = 100;
        tilesStore.resetCurrentComboCounter();
        expect(tilesStore.comboCounts).toEqual([1, 2, 100]);
      });

      it('sets current combo count to 0', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.currentComboCounter = 100;
        tilesStore.resetCurrentComboCounter();
        tilesStore.currentComboCounter = 0;
      });
    });

    describe('resetDisappearingLayers', () => {
      it('sets array of layers to an empty array', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.disappearingLayers = ['a'];
        tilesStore.resetDisappearingLayers();
        expect(tilesStore.disappearingLayers).toEqual([]);
      });
    });

    describe('resetFirstTile', () => {
      it('marks first tile as undefined', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.firstTile = [0, 0];
        tilesStore.resetFirstTile();
        expect(tilesStore.firstTile).toBeUndefined();
      });
    });

    describe('resetIntersectingLayerIds', () => {
      it('sets array of layers to an empty array', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.intersectingLayerIds = ['a'];
        tilesStore.resetIntersectingLayerIds();
        expect(tilesStore.intersectingLayerIds).toEqual([]);
      });
    });

    describe('resetSecondTile', () => {
      it('marks second tile as undefined', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.secondTile = [0, 0];
        tilesStore.resetSecondTile();
        expect(tilesStore.secondTile).toBeUndefined();
      });
    });

    describe('setActiveTile', () => {
      it('sets the active tile', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.activeTile = [0, 0];
        tilesStore.resetActiveTile();
        expect(tilesStore.activeTile).toBeUndefined();
      });
    });

    describe('setChipText', () => {
      it('sets chip text to go anywhere if matches will empty tile', async () => {
        const tileSet = mockTileSetData([[['a']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.intersectingLayerIds = ['a'];
        tilesStore.secondTile = [0, 0];
        tilesStore.setChipText();
        expect(tilesStore.chipText).toEqual('go anywhere');
      });

      it('sets chip text to current count if matches will not empty tile', async () => {
        const tileSet = mockTileSetData([[['a', 'b']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.intersectingLayerIds = ['a'];
        tilesStore.secondTile = [0, 0];
        tilesStore.currentComboCounter = 123;
        tilesStore.setChipText();
        expect(tilesStore.chipText).toEqual('123');
      });

      it('sets chip text to no matches if there are no matches', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.setChipText();
        expect(tilesStore.chipText).toEqual('no matches');
      });
    });

    describe('setDisappearingLayers', () => {
      it('pushes disappearing layers for both first and second tiles', async () => {
        const { tilesStore } = await mockTilesStore();
        const setPushDisappearingLayers = sinon.stub();
        tilesStore.pushDisappearingLayers = setPushDisappearingLayers;
        tilesStore.firstTile = [0, 0];
        tilesStore.secondTile = [1, 1];
        tilesStore.setDisappearingLayers();
        expect(setPushDisappearingLayers.calledTwice).toBeTruthy();
        expect(setPushDisappearingLayers.calledWith([0, 0])).toBeTruthy();
        expect(setPushDisappearingLayers.calledWith([1, 1])).toBeTruthy();
      });
    });

    describe('setFilteredTiles', () => {
      let clock: sinon.SinonFakeTimers;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('eventually filters interecting layers for both first and second tiles', async () => {
        const { tilesStore } = await mockTilesStore();
        const filterIntersectingLayers = sinon.stub();
        tilesStore.filterIntersectingLayers = filterIntersectingLayers;
        tilesStore.firstTile = [0, 0];
        tilesStore.secondTile = [1, 1];
        tilesStore.setFilteredTiles();
        expect(filterIntersectingLayers.notCalled).toBeTruthy();
        clock.tick(tilesStore.timeout + 1);
        expect(filterIntersectingLayers.calledTwice).toBeTruthy();
        expect(filterIntersectingLayers.calledWith([0, 0])).toBeTruthy();
        expect(filterIntersectingLayers.calledWith([1, 1])).toBeTruthy();
      });
    });

    describe('setFirstTile', () => {
      it('is a no-op if selected tile is empty', async () => {
        const tileSet = mockTileSetData([[[]]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.firstTile = undefined;
        tilesStore.setFirstTile(0, 0);
        expect(tilesStore.firstTile).toBeUndefined();
      });

      it('sets first tile if selected tile is not empty', async () => {
        const tileSet = mockTileSetData([[['a']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.firstTile = undefined;
        tilesStore.setFirstTile(0, 0);
        expect(tilesStore.firstTile).toEqual([0, 0]);
      });
    });

    describe('setIntersectingLayerIds', () => {
      it('sets intersecting layer IDs', async () => {
        const tileSet = mockTileSetData([
          [
            ['a', 'b'],
            ['b', 'c'],
          ],
        ]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.firstTile = [0, 0];
        tilesStore.secondTile = [0, 1];
        tilesStore.setIntersectingLayerIds();
        expect(tilesStore.intersectingLayerIds).toEqual(['b']);
      });
    });

    describe('setIsAnimating', () => {
      it('sets isAnimating', async () => {
        const { tilesStore } = await mockTilesStore();
        expect(tilesStore.isAnimating).toBeFalsy();
        tilesStore.setIsAnimating(true);
        expect(tilesStore.isAnimating).toBeTruthy();
      });
    });

    describe('setSecondTile', () => {
      it('is a no-op if second tile is empty', async () => {
        const tileSet = mockTileSetData([[[]]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.secondTile = undefined;
        tilesStore.setSecondTile(0, 0);
        expect(tilesStore.secondTile).toBeUndefined();
      });

      it('sets second tile if second tile is not empty', async () => {
        const tileSet = mockTileSetData([[['a']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.secondTile = undefined;
        tilesStore.setSecondTile(0, 0);
        expect(tilesStore.secondTile).toEqual([0, 0]);
      });
    });
  });

  describe('computed getters', () => {
    describe('appStyle', () => {
      it('reads color from theme', async () => {
        const getThemeStub = sinon.stub(api, 'getTheme');
        getThemeStub.resolves(mockTheme);
        const tilesStore = new TilesStore();

        await Promise.all(getThemeStub.returnValues);

        expect(tilesStore.appStyle).toEqual({
          color: 'white',
          backgroundColor: 'red',
        });
      });

      it('uses default when theme api call fails', async () => {
        const getThemeStub = sinon.stub(api, 'getTheme');
        getThemeStub.resolves(undefined);
        const tilesStore = new TilesStore();

        await Promise.all(getThemeStub.returnValues);

        expect(tilesStore.appStyle).toEqual({
          color: 'black',
          backgroundColor: 'white',
        });
      });
    });

    describe('chipClassName', () => {
      it('sets class if go anywhere', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.chipText = 'go anywhere';
        expect(tilesStore.chipClassName).toEqual('chip go-anywhere');
      });

      it('sets class if no matches', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.chipText = 'no matches';
        expect(tilesStore.chipClassName).toEqual('chip no-matches');
      });

      it('defaults to count class', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.chipText = undefined;
        expect(tilesStore.chipClassName).toEqual('chip count');
      });
    });

    describe('isEmpty', () => {
      it('returns true if second tile is empty', async () => {
        const tileSet = mockTileSetData([[[]]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.secondTile = [0, 0];
        expect(tilesStore.isEmpty).toEqual(true);
      });

      it('returns false if second tile is not empty', async () => {
        const tileSet = mockTileSetData([[['a']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.secondTile = [0, 0];
        expect(tilesStore.isEmpty).toEqual(false);
      });
    });

    describe('hasMatches', () => {
      it('returns true if there is at least one intersecting layer ID', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.intersectingLayerIds = ['a'];
        expect(tilesStore.hasMatches).toEqual(true);
      });

      it('returns false if there are no intersecting layer IDs', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.intersectingLayerIds = [];
        expect(tilesStore.hasMatches).toEqual(false);
      });
    });

    describe('longestComboCount', () => {
      it('returns current count if it is the longest count', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.comboCounts = [1, 2, 3];
        tilesStore.currentComboCounter = 100;
        expect(tilesStore.longestComboCount).toEqual(100);
      });

      it('returns longest count if current count if it is not the longest count', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.comboCounts = [1, 2, 3];
        tilesStore.currentComboCounter = 1;
        expect(tilesStore.longestComboCount).toEqual(3);
      });
    });

    describe('willEmptyTile', () => {
      it('returns true if intersecting layer IDs will empty tile', async () => {
        const tileSet = mockTileSetData([[['a']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.intersectingLayerIds = ['a'];
        tilesStore.secondTile = [0, 0];
        expect(tilesStore.willEmptyTile).toBeTruthy();
      });

      it('returns false if intersecting layer IDs will not empty tile', async () => {
        const tileSet = mockTileSetData([[['a']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.intersectingLayerIds = [];
        tilesStore.secondTile = [0, 0];
        expect(tilesStore.willEmptyTile).toBeFalsy();
      });
    });
  });

  describe('other functions', () => {
    describe('getLayerIds', () => {
      it('extracts layer IDs', async () => {
        const tileSet = mockTileSetData([[['a', 'b', 'c']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        expect(tilesStore.getLayerIds([0, 0])).toEqual(['a', 'b', 'c']);
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

        tilesStore.setActiveTile(0, 0);

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

        tilesStore.setActiveTile(0, 0);

        tileStyle = tilesStore.getTileStyle(0, 0);
        expect(tileStyle.boxShadow).toEqual('inset 0px 0px 0px 5px black');
      });
    });

    describe('isActiveTile', () => {
      it('returns true if tile is active', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.activeTile = [0, 0];
        expect(tilesStore.isActiveTile(0, 0)).toBeTruthy();
      });

      it('returns false if tile is not active', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.activeTile = [1, 1];
        expect(tilesStore.isActiveTile(0, 0)).toBeFalsy();
      });
    });

    describe('isDisappearingLayer', () => {
      it('returns true if is first or second tile', async () => {
        const tileSet = mockTileSetData([[['a'], ['b']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.firstTile = [0, 0];
        tilesStore.secondTile = [0, 1];
        tilesStore.disappearingLayers = ['a', 'b'];
        expect(tilesStore.isDisappearingLayer(0, 0, 'a')).toBeTruthy();
      });

      it('returns false if neither first or second tile', async () => {
        const tileSet = mockTileSetData([[['a'], ['b']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.firstTile = [0, 0];
        tilesStore.secondTile = [0, 1];
        tilesStore.disappearingLayers = ['a', 'b'];
        expect(tilesStore.isDisappearingLayer(1, 1, 'a')).toBeFalsy();
      });

      it('returns false is layer is not disappearing', async () => {
        const tileSet = mockTileSetData([[['a'], ['b']]]);
        const { tilesStore } = await mockTilesStore(tileSet);
        tilesStore.firstTile = [0, 0];
        tilesStore.secondTile = [0, 1];
        expect(tilesStore.isDisappearingLayer(0, 0, 'c')).toBeFalsy();
      });
    });

    describe('isFirstTile', () => {
      it('returns true if tile is set to first tile', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.firstTile = [0, 0];
        expect(tilesStore.isFirstTile(0, 0)).toBeTruthy();
      });

      it('returns false if tile is not set to first tile', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.firstTile = [1, 1];
        expect(tilesStore.isFirstTile(0, 0)).toBeFalsy();
      });
    });

    describe('isSecondTile', () => {
      it('returns true if tile is set to first tile', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.secondTile = [0, 0];
        expect(tilesStore.isSecondTile(0, 0)).toBeTruthy();
      });

      it('returns false if tile is not set to first tile', async () => {
        const { tilesStore } = await mockTilesStore();
        tilesStore.secondTile = [1, 1];
        expect(tilesStore.isSecondTile(0, 0)).toBeFalsy();
      });
    });
  });
});
