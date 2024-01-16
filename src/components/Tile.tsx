import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import { LayerData } from '../types/LayerData';
import './Tile.css';
import TileLayer from './TileLayer';

interface TileProps {
  rowIndex: number;
  columnIndex: number;
}

const Tile: FC<TileProps> = ({ rowIndex, columnIndex }) => {
  const { tilesStore } = useContext(RootContext);

  return (
    <div
      role="button"
      id={`tile_${rowIndex}_${columnIndex}`}
      onClick={() => tilesStore.onTileClick(rowIndex, columnIndex)}
      className={tilesStore.isSelected(rowIndex, columnIndex) ? 'selected' : ''}
      style={tilesStore.getTileStyle(rowIndex, columnIndex)}
    >
      {tilesStore.tileSet && tilesStore.tileSet[rowIndex][columnIndex].map((component: LayerData, i: number) => {
        return (
          <TileLayer key={`component_${i}`} component={component} zIndex={i} />
        );
      })}
    </div>
  );
};

export default observer(Tile);
