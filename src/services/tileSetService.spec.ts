import * as sinon from 'sinon';
import { LayerData } from '../types/LayerData';
import { TileData } from '../types/TileData';
import TileSetService from './tileSetService';

const mockLayerData = (groupName: string): LayerData => {
  return {
    groupName,
    id: '',
    svg: '',
  };
};

it('takes theme path and dimenions in constructor', () => {
  const tileSetService = new TileSetService('path/to/foo', 2, 2);
  expect(tileSetService.themePath).toEqual('path/to/foo');
  expect(tileSetService.rowSize).toEqual(2);
  expect(tileSetService.columnSize).toEqual(2);
});

it('throws an error if provided odd number of tiles', () => {
  const t = () => {
    new TileSetService('', 3, 3);
  };
  expect(t).toThrow(Error);
});

describe('findIndexesOfTilesMissingComponentType()', () => {
  const tileSetService = new TileSetService('path/to/foo', 2, 2);
  const tileSet = [
    [
      mockLayerData('foo'),
      mockLayerData('bar'),
      mockLayerData('baz'),
    ],
    [mockLayerData('foo')],
    [mockLayerData('foo')],
  ];

  it('has tiles missing type', () => {
    const results = tileSetService.findIndexesOfTilesMissingComponentType(
      tileSet,
      'bar'
    );

    expect(results).toEqual([1, 2]);
  });

  it('does not have tiles missing type', () => {
    const results = tileSetService.findIndexesOfTilesMissingComponentType(
      tileSet,
      'foo'
    );

    expect(results).toEqual([]);
  });
});

describe('formatTileSetData()', () => {
  it('formats tile set data', () => {
    const tileSetService = new TileSetService('path/to/foo', 2, 2);
    const input = [[], [], [], []];
    const expected = [
      [[], []],
      [[], []],
    ];
    expect(tileSetService.formatTileSetData(input)).toEqual(expected);
  });
});

describe('generateTileSetData()', () => {
  it('generates tile set data', () => {
    let tileSetService = new TileSetService('path/to/foo', 2, 2);
    const readThemeStub = sinon.stub();
    readThemeStub.returns({
      name: 'Foo Theme',
      layerGroups: [
        {
          name: 'back',
          variants: [
            { id: '1', svg: '1' },
            { id: '2', svg: '2' },
          ],
        },
        {
          name: 'front',
          variants: [
            { id: '3', svg: '3' },
            { id: '4', svg: '4' },
          ],
        },
      ],
    });
    tileSetService.readTheme = readThemeStub;

    tileSetService.generateTileSetData();

    expect(tileSetService.tileSet.length).toEqual(4);
    tileSetService.tileSet.every((tile: TileData) => {
      expect(tile.length).toEqual(2);
    });
  });
});

describe('getEmptyTilesArray()', () => {
  it('generates empty tiles array', () => {
    let tileSetService = new TileSetService('path/to/foo', 2, 2);
    let expected = [[], [], [], []];
    expect(tileSetService.getEmptyTilesArray()).toEqual(expected);

    tileSetService = new TileSetService('path/to/foo', 2, 3);
    expected = [[], [], [], [], [], []];
    expect(tileSetService.getEmptyTilesArray()).toEqual(expected);
  });
});

describe('pushComponent()', () => {
  it('adds component to tileset', () => {
    let tileSetService = new TileSetService('path/to/foo', 2, 2);
    expect(tileSetService.tileSet).toEqual([[], [], [], []]);
    tileSetService.pushComponent('type1', { id: 'id1', svg: 'svg1' });
    expect(tileSetService.tileSet).toEqual([
      [],
      [],
      [],
      [{ groupName: 'type1', id: 'id1', svg: 'svg1' }],
    ]);

    tileSetService.pushComponent('type1', { id: 'id2', svg: 'svg2' });
    expect(tileSetService.tileSet).toEqual([
      [],
      [],
      [{ groupName: 'type1', id: 'id1', svg: 'svg1' }],
      [{ groupName: 'type1', id: 'id2', svg: 'svg2' }],
    ]);
  });
});

describe('readTheme()', () => {
  it('loads JSON from path', () => {
    let tileSetService = new TileSetService(
      'src/assets/themes/hongKong.json',
      2,
      2
    );
    expect(tileSetService.readTheme()).toBeDefined();
  });
});
