import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { RootContext, RootContextType } from './RootContext';
import { LayerData } from './types/LayerData';
import { TileData } from './types/TileData';
import { TileRowData } from './types/TileRowData';
import { TileSetData } from './types/TileSetData';

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
  layerGroups: [],
};
