import { observer } from 'mobx-react-lite';
import React, { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import { ComponentData } from '../types/ComponentData';
import './Tile.css';
import TileLayer from './TileLayer';

interface TileProps {
  rowIndex: number;
  columnIndex: number;
}

const Tile: FC<TileProps> = ({ rowIndex, columnIndex }) => {
  const { tilesStore } = useContext(RootContext);
  const tile = tilesStore.tileSet[rowIndex][columnIndex];

  return (
    <div
      role="button"
      id={`tile_${rowIndex}_${columnIndex}`}
      onClick={() => tilesStore.onTileClick(rowIndex, columnIndex)}
      className={tilesStore.isSelected(rowIndex, columnIndex) ? 'selected' : ''}
      style={tilesStore.getStyle(rowIndex, columnIndex)}
    >
      {tile.map((component: ComponentData, i: number) => {
        return (
          <TileLayer key={`component_${i}`} component={component} zIndex={i} />
        );
      })}
    </div>
  );
};

export default observer(Tile);
