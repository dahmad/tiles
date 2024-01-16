import { observer } from 'mobx-react-lite';
import { FC, useContext } from 'react';
import { RootContext } from '../RootContext';
import { LayerData } from '../types/LayerData';
import Chip from './Chip';
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
      className={
        tilesStore.isActiveTile(rowIndex, columnIndex) ? 'selected' : ''
      }
      style={tilesStore.getTileStyle(rowIndex, columnIndex)}
    >
      <Chip rowIndex={rowIndex} columnIndex={columnIndex} />
      {tilesStore.tileSet &&
        tilesStore.tileSet[rowIndex][columnIndex].map(
          (component: LayerData, i: number) => {
            return (
              <TileLayer
                key={`component_${i}`}
                rowIndex={rowIndex}
                columnIndex={columnIndex}
                component={component}
                zIndex={i}
              />
            );
          }
        )}
    </div>
  );
};

export default observer(Tile);
