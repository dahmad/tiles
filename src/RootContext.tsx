import { ReactNode, createContext, useMemo, useState } from 'react';
import TilesStore from './TilesStore';

export interface RootContextType {
  tilesStore: TilesStore;
}

export const RootContext = createContext(null as unknown as RootContextType);

interface RootContextProviderProps {
  theme?: string;
  rowSize?: number;
  columnSize?: number;
  children: ReactNode;
}

export function RootContextProvider({
  theme,
  rowSize,
  columnSize,
  children,
}: RootContextProviderProps) {
  theme ||= 'test';
  rowSize ||= 5;
  columnSize ||= 6;
  const [tilesStore] = useState(() => new TilesStore(theme, rowSize, columnSize));
  const providerValue = useMemo(() => {
    return { tilesStore };
  }, [tilesStore]);

  return (
    <RootContext.Provider value={providerValue}>
      {children}
    </RootContext.Provider>
  );
}
