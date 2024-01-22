import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import sinon from 'sinon';
import { RootContext, RootContextType } from './RootContext';
import TilesStore from './TilesStore';
import * as api from './api';
import { LayerData } from './types/LayerData';
import { Theme } from './types/Theme';
import { TileData } from './types/TileData';
import { TileRowData } from './types/TileRowData';
import { TileSetData } from './types/TileSetData';
import nock from 'nock';

export const renderWithMockProvider = (
  childen: ReactNode,
  providerProps: RootContextType
) => {
  return render(
    <RootContext.Provider value={providerProps}>{childen}</RootContext.Provider>
  );
};

export const mockLayerData = (
  groupName: string,
  id: string,
  svg: string
): LayerData => {
  return { groupName, id, svg };
};

export const mockTileData = (componentIds: string[]): TileData => {
  return componentIds.map((componentId: string) => {
    return mockLayerData('', componentId, '');
  });
};

export const mockTileRowData = (tileRow: string[][]): TileRowData => {
  return tileRow.map((componentIds: string[]) => {
    return mockTileData(componentIds);
  });
};

export const mockTileSetData = (tileSet: string[][][]): TileSetData => {
  return tileSet.map((tileRow: string[][]) => {
    return mockTileRowData(tileRow);
  });
};

export const mockTheme = {
  name: 'Foo',
  appBackgroundColor: 'red',
  fontColor: 'white',
  tileBackgroundColorPrimary: 'blue',
  tileBackgroundColorSecondary: 'black',
  selectedTileInsetColor: 'yellow',
  layerGroups: [],
};

type MockTileStore = {
  generateTileSetStub: sinon.SinonStub;
  getThemeStub: sinon.SinonStub;
  tilesStore: TilesStore;
};

export const defaultMockTileSet = mockTileSetData([
  [
    ['a', 'b'],
    ['a', 'b'],
  ],
  [
    ['a', 'b'],
    ['a', 'b'],
  ],
]);

export const mockTilesStore = async (
  tileSet: TileSetData = defaultMockTileSet,
  theme: Theme = mockTheme,
  themeName: string = 'test'
): Promise<MockTileStore> => {
  const generateTileSetStub = sinon.stub(api, 'generateTileSet');
  generateTileSetStub.resolves(tileSet);
  const getThemeStub = sinon.stub(api, 'getTheme');
  getThemeStub.resolves(theme);
  const tilesStore = new TilesStore(themeName);
  await Promise.all(generateTileSetStub.returnValues);
  await Promise.all(getThemeStub.returnValues);
  return {
    generateTileSetStub,
    getThemeStub,
    tilesStore,
  };
};

export const mockGetThemeSuccess = (theme: string, expectedResponse: Theme) => {
  return nock('http://127.0.0.1:8000')
    .get(`/theme/${theme}`)
    .reply(200, expectedResponse);
};

export const mockGetThemeFailure = () => {
  return nock('http://127.0.0.1:8000').get('/theme/test').reply(422);
};

export const mockGenerateTileSetSuccess = (expectedResponse: TileSetData) => {
  return nock('http://127.0.0.1:8000')
    .get('/theme/test/generate?rowSize=5&columnSize=6')
    .reply(200, expectedResponse);
};

export const mockGenerateTileSetFailure = () => {
  return nock('http://127.0.0.1:8000')
    .get('/theme/test/generate?rowSize=5&columnSize=6')
    .reply(422);
};
