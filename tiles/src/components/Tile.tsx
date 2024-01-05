import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import ComboStore from '../ComboStore';
import { RootContext } from '../RootContext';
import './Tile.css';

interface TileProps {
  rowIndex: number;
  columnIndex: number;
}

const shouldSetSelectedTileIndex = (
  comboStore: ComboStore,
  rowIndex: number,
  columnIndex: number
): boolean => {
  if (comboStore.selectedTileIndex === undefined) {
    return true;
  } else {
    return (
      comboStore.selectedTileIndex[0] === rowIndex &&
      comboStore.selectedTileIndex[1] === columnIndex
    );
  }
};

const Tile: FC<TileProps> = ({ rowIndex, columnIndex }) => {
  const { comboStore } = useContext(RootContext);

  return (
    <button
      id={`tile_${rowIndex}_${columnIndex}`}
      disabled={comboStore.tileSet[rowIndex][columnIndex].length === 0}
      onClick={() => {
        if (shouldSetSelectedTileIndex(comboStore, rowIndex, columnIndex)) {
          comboStore.setSelectedTileIndex(rowIndex, columnIndex);
        } else {
          comboStore.matchTiles(rowIndex, columnIndex);
        }
      }}
    >
      {String(comboStore.tileSet[rowIndex][columnIndex])}
    </button>
  );
};

export default observer(Tile);
