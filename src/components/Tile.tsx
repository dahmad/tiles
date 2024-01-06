import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import { ComponentData } from '../types/ComponentData';
import './Tile.css';

interface TileProps {
  rowIndex: number;
  columnIndex: number;
}

const backgroundColor = (rowIndex: number, columnIndex: number): string => {
  if (rowIndex % 2 === 0 && columnIndex % 2 === 0) {
    return 'white';
  } else if (rowIndex % 2 === 0 && columnIndex % 2 !== 0) {
    return '#dddddd';
  } else if (rowIndex % 2 !== 0 && columnIndex % 2 === 0) {
    return '#dddddd';
  }

  return 'white';
};

const Tile: FC<TileProps> = ({ rowIndex, columnIndex }) => {
  const { tilesStore } = useContext(RootContext);
  const tile = tilesStore.tileSet[rowIndex][columnIndex];

  return (
    <div
      role="button"
      id={`tile_${rowIndex}_${columnIndex}`}
      onClick={() => tilesStore.onTileClick(rowIndex, columnIndex)}
      className={tilesStore.isSelected(rowIndex, columnIndex) ? 'selected' : ''}
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