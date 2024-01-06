import { ReactNode, createContext, useMemo, useState } from 'react';
import TilesStore from './TilesStore';
import testTileSet from './assets/tileSets/testTileSet.json';
import { TileSetData } from './types/TileSetData';

export interface RootContextType {
  tilesStore: TilesStore;
}

export const RootContext = createContext(null as unknown as RootContextType);

interface RootContextProviderProps {
  tileSetData?: TileSetData | undefined;
  children: ReactNode;
}

export function RootContextProvider({
  tileSetData,
  children,
}: RootContextProviderProps) {
  const tiles = tileSetData === undefined ? testTileSet : tileSetData;
  const [tilesStore] = useState(() => new TilesStore(tiles));
  const providerValue = useMemo(() => {
    return { tilesStore };
  }, [tilesStore]);

  return (
    <RootContext.Provider value={providerValue}>
      {children}
    </RootContext.Provider>
  );
}
