import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import ComboStore from '../ComboStore';
import { RootContext } from '../RootContext';
import { ComponentData } from '../types/ComponentData';
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

const isSelected = (
  comboStore: ComboStore,
  rowIndex: number,
  columnIndex: number
): boolean => {
  if (comboStore.selectedTileIndex === undefined) {
    return false;
  } else {
    return (
      comboStore.selectedTileIndex[0] === rowIndex &&
      comboStore.selectedTileIndex[1] === columnIndex
    );
  }
};

const backgroundColor = (rowIndex: number, columnIndex: number): string => {
  if (rowIndex % 2 === 0 && columnIndex % 2 === 0) {
    return 'white';
  } else if (rowIndex % 2 === 0 && columnIndex % 2 !== 0) {
    return '#dddddd';
  } else if (rowIndex % 2 !== 0 && columnIndex % 2 === 0) {
    return '#dddddd';
  }

  return '';
};

const Tile: FC<TileProps> = ({ rowIndex, columnIndex }) => {
  const { comboStore } = useContext(RootContext);
  const tile = comboStore.tileSet[rowIndex][columnIndex];

  return (
    <div
      role="button"
      id={`tile_${rowIndex}_${columnIndex}`}
      onClick={() => {
        if (shouldSetSelectedTileIndex(comboStore, rowIndex, columnIndex)) {
          comboStore.setSelectedTileIndex(rowIndex, columnIndex);
        } else {
          comboStore.matchTiles(rowIndex, columnIndex);
        }
      }}
      className={
        isSelected(comboStore, rowIndex, columnIndex) ? 'selected' : ''
      }
      style={{
        backgroundColor: backgroundColor(rowIndex, columnIndex),
      }}
    >
      {tile.map((component: ComponentData, i: number) => {
        return (
          <img
            key={`component_${i}`}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(component.svg)}`}
            alt={component.id}
            style={{ zIndex: i + 1 }}
          />
        );
      })}
    </div>
  );
};

export default observer(Tile);
