import { ReactNode, createContext, useMemo, useState } from 'react';
import ComboStore from './ComboStore';
import { TileSetData } from './types/TileSetData';

export interface RootContextType {
    comboStore: ComboStore;
}

export const RootContext = createContext(null as unknown as RootContextType);

interface RootContextProviderProps {
  tileSetData?: TileSetData | undefined;
  children: ReactNode;
}

// This is temporary
const mockTileSet = [
  [
    { contents: [1,2,3] },
    { contents: [1,3,5] },
  ],
  [
    { contents: [6,7,9] },
    { contents: [0,2,9] },
  ],
] as TileSetData;

export function RootContextProvider({ tileSetData, children }: RootContextProviderProps) {
  const tiles = tileSetData === undefined ? mockTileSet : tileSetData
  const [comboStore] = useState(() => new ComboStore(tiles));
  const providerValue = useMemo(() => {
    return { comboStore };
  }, [comboStore]);

  return <RootContext.Provider value={providerValue}>{children}</RootContext.Provider>;
}
